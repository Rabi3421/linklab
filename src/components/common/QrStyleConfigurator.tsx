'use client';

import { useRef, useState } from 'react';
import type React from 'react';
import StyledQrCode from '@/components/common/StyledQrCode';
import Icon from '@/components/ui/AppIcon';
import {
  DEFAULT_QR_STYLE,
  QR_LOGO_MAX_BYTES,
  QR_CORNER_STYLES,
  QR_DOT_STYLES,
  QR_FRAME_STYLES,
  QR_STYLE_PRESETS,
  getQrPreset,
  isValidQrLogoDataUrl,
  resolveQrStyleConfig,
} from '@/lib/links/qr-style';
import type { QrStyleConfig } from '@/lib/links/types';

interface QrStyleConfiguratorProps {
  value?: QrStyleConfig;
  onChange: (value: QrStyleConfig) => void;
  previewUrl: string;
  fallbackQrCodeDataUrl?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
}

export default function QrStyleConfigurator({
  value,
  onChange,
  previewUrl,
  fallbackQrCodeDataUrl,
  title = 'Styled QR builder',
  description = 'Fine-tune colors and patterns before you publish the link.',
  disabled = false,
}: QrStyleConfiguratorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState('');
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const resolvedValue = resolveQrStyleConfig(value || DEFAULT_QR_STYLE);
  const previewSignature = [
    resolvedValue.presetId,
    resolvedValue.foregroundColor,
    resolvedValue.cornerColor,
    resolvedValue.backgroundColor,
    resolvedValue.dotStyle,
    resolvedValue.cornerStyle,
    resolvedValue.frameStyle,
    resolvedValue.logoDataUrl || '',
    previewUrl,
  ].join('|');

  const optimizeLogoFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Unable to prepare the logo canvas.'));
          return;
        }

        const maxSide = 96;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/png', 0.92);
        URL.revokeObjectURL(objectUrl);
        resolve(optimizedDataUrl);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Unable to read the selected logo image.'));
      };

      image.src = objectUrl;
    });

  const handlePresetChange = (presetId: string) => {
    const preset = getQrPreset(presetId);
    const nextValue = resolveQrStyleConfig({
      ...preset.config,
      logoDataUrl: resolvedValue.logoDataUrl,
    });
    onChange(nextValue);
  };

  const handleFieldChange = (field: keyof QrStyleConfig, fieldValue: string) => {
    onChange(resolveQrStyleConfig({ ...resolvedValue, [field]: fieldValue }));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setLogoError('Please upload a PNG, JPG, WEBP, or SVG image.');
      event.target.value = '';
      return;
    }

    if (selectedFile.size > QR_LOGO_MAX_BYTES) {
      setLogoError('Logo image is too large. Keep it under 350 KB for reliable scanning.');
      event.target.value = '';
      return;
    }

    setIsProcessingLogo(true);

    try {
      const optimizedLogo = await optimizeLogoFile(selectedFile);

      if (!isValidQrLogoDataUrl(optimizedLogo)) {
        setLogoError(
          'This image could not be optimized for QR logo embedding. Try a simpler icon.'
        );
        event.target.value = '';
        setIsProcessingLogo(false);
        return;
      }

      setLogoError('');
      onChange(resolveQrStyleConfig({ ...resolvedValue, logoDataUrl: optimizedLogo }));
    } catch {
      setLogoError('Unable to process the selected logo image. Try another file.');
    } finally {
      event.target.value = '';
      setIsProcessingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoError('');
    setIsProcessingLogo(false);
    onChange(resolveQrStyleConfig({ ...resolvedValue, logoDataUrl: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4 md:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Icon name="SparklesIcon" size={14} variant="solid" />
            Styled QR
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card p-4">
          <StyledQrCode
            key={previewSignature}
            data={previewUrl}
            qrCodeDataUrl={fallbackQrCodeDataUrl || ''}
            qrStyle={resolvedValue}
            size={200}
            className="mx-auto"
            imageClassName="border border-border bg-background p-2"
          />
          <div className="mt-4 rounded-xl bg-muted/40 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Preview link
            </p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">{previewUrl}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">Preset styles</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {QR_STYLE_PRESETS.map((preset) => {
                const isActive = resolvedValue.presetId === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => handlePresetChange(preset.id)}
                    className={`rounded-xl border p-3 text-left transition-all duration-250 ${isActive ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-card hover:bg-muted/40'}`}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: preset.config.foregroundColor }}
                      />
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: preset.config.cornerColor }}
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-border"
                        style={{ backgroundColor: preset.config.backgroundColor }}
                      />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{preset.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="rounded-xl border border-border bg-card p-3">
              <span className="mb-2 block text-sm font-medium text-foreground">Dots color</span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={resolvedValue.foregroundColor}
                  disabled={disabled}
                  onChange={(event) => handleFieldChange('foregroundColor', event.target.value)}
                  className="h-11 w-12 rounded border border-border bg-background"
                />
                <span className="text-sm text-muted-foreground">
                  {resolvedValue.foregroundColor}
                </span>
              </div>
            </label>

            <label className="rounded-xl border border-border bg-card p-3">
              <span className="mb-2 block text-sm font-medium text-foreground">Corners color</span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={resolvedValue.cornerColor}
                  disabled={disabled}
                  onChange={(event) => handleFieldChange('cornerColor', event.target.value)}
                  className="h-11 w-12 rounded border border-border bg-background"
                />
                <span className="text-sm text-muted-foreground">{resolvedValue.cornerColor}</span>
              </div>
            </label>

            <label className="rounded-xl border border-border bg-card p-3">
              <span className="mb-2 block text-sm font-medium text-foreground">Background</span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={resolvedValue.backgroundColor}
                  disabled={disabled}
                  onChange={(event) => handleFieldChange('backgroundColor', event.target.value)}
                  className="h-11 w-12 rounded border border-border bg-background"
                />
                <span className="text-sm text-muted-foreground">
                  {resolvedValue.backgroundColor}
                </span>
              </div>
            </label>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Center logo</p>
                <p className="text-sm text-muted-foreground">
                  Upload your brand mark to embed it in the QR center. Keep the file lightweight for
                  better scan reliability.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  disabled={disabled || isProcessingLogo}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isProcessingLogo}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-250 hover:shadow-md disabled:opacity-60"
                >
                  <Icon
                    name={isProcessingLogo ? 'ArrowPathIcon' : 'ArrowUpTrayIcon'}
                    size={16}
                    variant="outline"
                    className={isProcessingLogo ? 'animate-spin' : ''}
                  />
                  {isProcessingLogo
                    ? 'Optimizing...'
                    : resolvedValue.logoDataUrl
                      ? 'Replace logo'
                      : 'Upload logo'}
                </button>
                {resolvedValue.logoDataUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    disabled={disabled || isProcessingLogo}
                    className="inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-sm font-medium text-foreground transition-all duration-250 hover:bg-muted/80 disabled:opacity-60"
                  >
                    <Icon name="TrashIcon" size={16} variant="outline" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/40">
                {resolvedValue.logoDataUrl ? (
                  <img
                    src={resolvedValue.logoDataUrl}
                    alt="QR logo preview"
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <Icon
                    name="PhotoIcon"
                    size={24}
                    variant="outline"
                    className="text-muted-foreground"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Recommended: square logo, transparent background
                </p>
                <p className="text-sm text-muted-foreground">
                  Best results come from simple icons under 350 KB. Uploaded logos are automatically
                  resized for faster QR preview rendering.
                </p>
                {logoError && <p className="mt-2 text-sm text-error">{logoError}</p>}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label>
              <span className="mb-2 block text-sm font-medium text-foreground">Dots style</span>
              <select
                value={resolvedValue.dotStyle}
                disabled={disabled}
                onChange={(event) => handleFieldChange('dotStyle', event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {QR_DOT_STYLES.map((dotStyle) => (
                  <option key={dotStyle} value={dotStyle}>
                    {dotStyle}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-foreground">Corner style</span>
              <select
                value={resolvedValue.cornerStyle}
                disabled={disabled}
                onChange={(event) => handleFieldChange('cornerStyle', event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {QR_CORNER_STYLES.map((cornerStyle) => (
                  <option key={cornerStyle} value={cornerStyle}>
                    {cornerStyle}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-foreground">
                Frame treatment
              </span>
              <select
                value={resolvedValue.frameStyle}
                disabled={disabled}
                onChange={(event) => handleFieldChange('frameStyle', event.target.value)}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {QR_FRAME_STYLES.map((frameStyle) => (
                  <option key={frameStyle} value={frameStyle}>
                    {frameStyle}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
