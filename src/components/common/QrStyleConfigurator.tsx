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
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#141922] shadow-[0_24px_60px_rgba(0,0,0,0.40)]">
      {/* Header */}
      <div className="border-b border-white/8 bg-[#0e1520] px-5 py-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
            <Icon name="SparklesIcon" size={12} variant="solid" />
            Styled QR
          </div>
        </div>
        <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-white/45">{description}</p>
      </div>

      {/* Two-panel layout: config left, live preview right */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">

        {/* LEFT — config */}
        <div className="space-y-5 border-r border-white/8 bg-[#141922] px-5 py-5 md:px-6">

          {/* Preset styles */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Preset styles</p>
            <div className="grid grid-cols-2 gap-2">
              {QR_STYLE_PRESETS.map((preset) => {
                const isActive = resolvedValue.presetId === preset.id;
                const previewStyle = resolveQrStyleConfig(preset.config);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => handlePresetChange(preset.id)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all disabled:opacity-50 ${
                      isActive
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-300 shadow-sm'
                        : 'border-white/10 bg-white/4 text-white/60 hover:border-white/20 hover:bg-white/8 hover:text-white/90'
                    }`}
                  >
                    <span
                      className="h-5 w-5 flex-shrink-0 rounded-md border border-white/15"
                      style={{ background: previewStyle.foregroundColor }}
                    />
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Colors</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { label: 'QR color', field: 'foregroundColor' as const, value: resolvedValue.foregroundColor },
                { label: 'Corner color', field: 'cornerColor' as const, value: resolvedValue.cornerColor },
                { label: 'Background', field: 'backgroundColor' as const, value: resolvedValue.backgroundColor },
              ].map(({ label, field, value }) => (
                <label key={field} className={`flex cursor-pointer flex-col gap-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  <span className="text-xs font-medium text-white/50">{label}</span>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2">
                    <input
                      type="color"
                      value={value}
                      disabled={disabled}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs uppercase text-white/65">{value}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Dot style */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Dot style</p>
            <div className="flex flex-wrap gap-1.5">
              {QR_DOT_STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleFieldChange('dotStyle', s)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium capitalize transition-all disabled:opacity-50 ${
                    resolvedValue.dotStyle === s
                      ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                      : 'border-white/10 bg-white/4 text-white/55 hover:border-white/20 hover:text-white/85'
                  }`}
                >
                  {s.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Corner style */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Corner style</p>
            <div className="flex flex-wrap gap-1.5">
              {QR_CORNER_STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleFieldChange('cornerStyle', s)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium capitalize transition-all disabled:opacity-50 ${
                    resolvedValue.cornerStyle === s
                      ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                      : 'border-white/10 bg-white/4 text-white/55 hover:border-white/20 hover:text-white/85'
                  }`}
                >
                  {s.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Frame style */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Frame style</p>
            <div className="flex flex-wrap gap-1.5">
              {QR_FRAME_STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleFieldChange('frameStyle', s)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium capitalize transition-all disabled:opacity-50 ${
                    resolvedValue.frameStyle === s
                      ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                      : 'border-white/10 bg-white/4 text-white/55 hover:border-white/20 hover:text-white/85'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Logo upload */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Logo (optional)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              disabled={disabled || isProcessingLogo}
              className="hidden"
            />
            {resolvedValue.logoDataUrl ? (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/6 p-3">
                <img
                  src={resolvedValue.logoDataUrl}
                  alt="QR logo"
                  className="h-10 w-10 rounded-lg border border-white/15 object-contain"
                />
                <span className="flex-1 text-xs text-white/50">Logo embedded in QR center</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isProcessingLogo}
                  className="rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  disabled={disabled || isProcessingLogo}
                  className="rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/60 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400 transition disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isProcessingLogo}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/14 bg-white/4 px-4 py-3 text-left transition hover:border-amber-500/40 hover:bg-amber-500/5 disabled:opacity-50`}
              >
                <Icon name="PhotoIcon" size={18} variant="solid" className="text-white/35 flex-shrink-0" />
                <span className="text-xs text-white/50">
                  {isProcessingLogo ? 'Optimizing…' : 'Upload a logo (PNG, JPG, SVG — max 350 KB)'}
                </span>
              </button>
            )}
            {logoError && <p className="mt-2 text-xs text-red-400">{logoError}</p>}
          </div>
        </div>

        {/* RIGHT — live preview */}
        <div className="flex flex-col bg-[#0e1520] px-5 py-5 md:px-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400/70">Live preview</p>
          <p className="mb-4 text-xs text-white/40">Updates instantly as you configure.</p>

          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-5">
            <StyledQrCode
              key={previewSignature}
              data={previewUrl}
              qrCodeDataUrl={fallbackQrCodeDataUrl || ''}
              qrStyle={resolvedValue}
              size={180}
              className="mx-auto"
              imageClassName="rounded-2xl border border-white/10"
            />
            <div className="mt-4 w-full rounded-xl border border-white/8 bg-white/5 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">Destination</p>
              <p className="mt-0.5 truncate text-xs font-medium text-white/70">{previewUrl}</p>
            </div>
          </div>

          <p className="mt-3 text-center text-[10px] leading-relaxed text-white/30">Saved with every new short link</p>
        </div>
      </div>
    </div>
  );
}
