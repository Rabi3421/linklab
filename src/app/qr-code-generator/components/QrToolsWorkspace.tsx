'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import StyledQrCode from '@/components/common/StyledQrCode';
import Icon from '@/components/ui/AppIcon';
import { DEFAULT_QR_STYLE, QR_STYLE_PRESETS, QR_DOT_STYLES, QR_CORNER_STYLES, QR_FRAME_STYLES, getQrPreset, resolveQrStyleConfig, isValidQrLogoDataUrl, QR_LOGO_MAX_BYTES } from '@/lib/links/qr-style';
import { downloadStyledQrCode } from '@/lib/links/qr-style-client';
import type { QrStyleConfig } from '@/lib/links/types';

const defaultQrText = 'https://www.linklab.in';

const isLikelyUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const createSafeFilename = (value: string) => {
  const candidate = value
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return candidate || 'linklab-qr-code';
};

const readQrFromFile = async (file: File) => {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error('Unable to read the uploaded image.'));
      nextImage.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      throw new Error('Unable to prepare the scanner canvas.');
    }

    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height);
    const decoded = jsQR(imageData.data, width, height, {
      inversionAttempts: 'attemptBoth',
    });

    return {
      previewUrl: imageUrl,
      result: decoded?.data || '',
    };
  } catch (error) {
    URL.revokeObjectURL(imageUrl);
    throw error;
  }
};

export default function QrToolsWorkspace() {
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');
  const [qrValue, setQrValue] = useState(defaultQrText);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [qrStyle, setQrStyle] = useState<QrStyleConfig>(DEFAULT_QR_STYLE);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(true);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading'>('idle');
  const [copiedGeneratorValue, setCopiedGeneratorValue] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [scanPreviewUrl, setScanPreviewUrl] = useState('');
  const [scanFileName, setScanFileName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copiedScanValue, setCopiedScanValue] = useState(false);
  const [logoError, setLogoError] = useState('');
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const scanFileInputRef = useRef<HTMLInputElement>(null);

  const resolvedStyle = useMemo(() => resolveQrStyleConfig(qrStyle), [qrStyle]);
  const activeValue = qrValue.trim() || defaultQrText;
  const scanResultIsUrl = isLikelyUrl(scanResult.trim());

  useEffect(() => {
    let isCancelled = false;

    const generatePreview = async () => {
      setIsGeneratingPreview(true);
      try {
        const dataUrl = await QRCode.toDataURL(activeValue, {
          margin: resolvedStyle.frameStyle === 'outline' ? 2 : 1,
          width: 640,
          color: {
            dark: resolvedStyle.foregroundColor,
            light: resolvedStyle.backgroundColor,
          },
        });

        if (!isCancelled) {
          setQrCodeDataUrl(dataUrl);
        }
      } finally {
        if (!isCancelled) {
          setIsGeneratingPreview(false);
        }
      }
    };

    generatePreview();

    return () => {
      isCancelled = true;
    };
  }, [activeValue, resolvedStyle.backgroundColor, resolvedStyle.foregroundColor, resolvedStyle.frameStyle]);

  useEffect(() => {
    if (!copiedGeneratorValue) {
      return undefined;
    }

    const timer = window.setTimeout(() => setCopiedGeneratorValue(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copiedGeneratorValue]);

  useEffect(() => {
    if (!copiedScanValue) {
      return undefined;
    }

    const timer = window.setTimeout(() => setCopiedScanValue(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copiedScanValue]);

  useEffect(() => {
    return () => {
      if (scanPreviewUrl) {
        URL.revokeObjectURL(scanPreviewUrl);
      }
    };
  }, [scanPreviewUrl]);

  const handleDownload = async () => {
    setDownloadState('downloading');
    try {
      await downloadStyledQrCode({
        data: activeValue,
        size: 960,
        style: resolvedStyle,
        name: createSafeFilename(activeValue),
        extension: 'png',
      });
    } finally {
      setDownloadState('idle');
    }
  };

  const handleCopyGeneratorValue = async () => {
    await navigator.clipboard.writeText(activeValue);
    setCopiedGeneratorValue(true);
  };

  const handleScanUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setScanError('Please upload a PNG, JPG, WEBP, or other image file containing a QR code.');
      event.target.value = '';
      return;
    }

    setIsScanning(true);
    setScanError('');

    try {
      if (scanPreviewUrl) {
        URL.revokeObjectURL(scanPreviewUrl);
      }

      const decoded = await readQrFromFile(selectedFile);
      setScanPreviewUrl(decoded.previewUrl);
      setScanFileName(selectedFile.name);

      if (!decoded.result) {
        setScanResult('');
        setScanError('No QR code could be detected in that image. Try a clearer upload or a higher-resolution screenshot.');
      } else {
        setScanResult(decoded.result);
        setScanError('');
      }
    } catch (error) {
      setScanResult('');
      setScanError(error instanceof Error ? error.message : 'Unable to scan that QR code image.');
    } finally {
      setIsScanning(false);
      event.target.value = '';
    }
  };

  const handleCopyScanValue = async () => {
    if (!scanResult) {
      return;
    }

    await navigator.clipboard.writeText(scanResult);
    setCopiedScanValue(true);
  };

  // Logo handlers for inline QR style configurator
  const optimizeLogoFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) { URL.revokeObjectURL(objectUrl); reject(new Error('Canvas not available.')); return; }
        const maxSide = 96;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL('image/png', 0.92));
      };
      image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Unable to read logo.')); };
      image.src = objectUrl;
    });

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setLogoError('Please upload a PNG, JPG, WEBP, or SVG image.'); event.target.value = ''; return; }
    if (file.size > QR_LOGO_MAX_BYTES) { setLogoError('Logo is too large. Keep it under 350 KB.'); event.target.value = ''; return; }
    setIsProcessingLogo(true);
    try {
      const optimized = await optimizeLogoFile(file);
      if (!isValidQrLogoDataUrl(optimized)) { setLogoError('Image could not be embedded. Try a simpler icon.'); return; }
      setLogoError('');
      setQrStyle((prev) => resolveQrStyleConfig({ ...resolveQrStyleConfig(prev), logoDataUrl: optimized }));
    } catch { setLogoError('Unable to process the selected logo.'); }
    finally { event.target.value = ''; setIsProcessingLogo(false); }
  };

  const handleRemoveLogo = () => {
    setLogoError('');
    setIsProcessingLogo(false);
    setQrStyle((prev) => resolveQrStyleConfig({ ...resolveQrStyleConfig(prev), logoDataUrl: undefined }));
    if (logoFileInputRef.current) logoFileInputRef.current.value = '';
  };

  const handleStyleFieldChange = (field: keyof QrStyleConfig, value: string) => {
    setQrStyle((prev) => resolveQrStyleConfig({ ...resolveQrStyleConfig(prev), [field]: value }));
  };

  const handlePresetChange = (presetId: string) => {
    const preset = getQrPreset(presetId);
    setQrStyle(resolveQrStyleConfig({ ...preset.config, logoDataUrl: resolvedStyle.logoDataUrl }));
  };

  return (
    <div>
      {/* Main unified tool card */}
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#141922] shadow-[0_32px_80px_rgba(0,0,0,0.48)]">
        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-white/8 bg-[#0e1520] px-5 py-3 md:px-8">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-white/45 hover:bg-white/6 hover:text-white/80'
            }`}
          >
            <Icon name="QrCodeIcon" size={16} variant="solid" />
            Generate QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'scan'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-white/45 hover:bg-white/6 hover:text-white/80'
            }`}
          >
            <Icon name="MagnifyingGlassIcon" size={16} variant="solid" />
            Scan QR
          </button>
        </div>

        {activeTab === 'generate' ? (
          /* ─── Generate: left config + right live preview ─── */
          <div className="grid min-h-[640px] lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">

            {/* LEFT — scrollable config panel */}
            <div className="overflow-y-auto border-r border-white/8 bg-[#141922] px-5 py-6 md:px-8 md:py-8">
              {/* URL input */}
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-semibold text-white">QR code destination</label>
                <p className="mb-3 text-xs leading-relaxed text-white/45">Enter a URL, landing page, menu link, or any text you want to encode.</p>
                <textarea
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  rows={3}
                  placeholder="https://example.com/your-link"
                  className="w-full rounded-2xl border border-white/12 bg-[#1e2a3a] px-4 py-3 text-sm text-white/90 outline-none ring-0 transition placeholder:text-white/30 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>

              {/* Preset styles */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-white">Preset styles</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {QR_STYLE_PRESETS.map((preset) => {
                    const isActive = resolvedStyle.presetId === preset.id;
                    const previewStyle = resolveQrStyleConfig(preset.config);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetChange(preset.id)}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all ${
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
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-white">Colors</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'QR color', field: 'foregroundColor' as const, value: resolvedStyle.foregroundColor },
                    { label: 'Corner color', field: 'cornerColor' as const, value: resolvedStyle.cornerColor },
                    { label: 'Background', field: 'backgroundColor' as const, value: resolvedStyle.backgroundColor },
                  ].map(({ label, field, value }) => (
                    <label key={field} className="flex cursor-pointer flex-col gap-1.5">
                      <span className="text-xs font-medium text-white/55">{label}</span>
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleStyleFieldChange(field, e.target.value)}
                          className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
                        />
                        <span className="font-mono text-xs uppercase text-white/70">{value}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dot style */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-white">Dot style</p>
                <div className="flex flex-wrap gap-2">
                  {QR_DOT_STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStyleFieldChange('dotStyle', s)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                        resolvedStyle.dotStyle === s
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
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-white">Corner style</p>
                <div className="flex flex-wrap gap-2">
                  {QR_CORNER_STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStyleFieldChange('cornerStyle', s)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                        resolvedStyle.cornerStyle === s
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
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-white">Frame style</p>
                <div className="flex flex-wrap gap-2">
                  {QR_FRAME_STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStyleFieldChange('frameStyle', s)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                        resolvedStyle.frameStyle === s
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
              <div className="mb-2">
                <p className="mb-3 text-sm font-semibold text-white">Logo (optional)</p>
                {resolvedStyle.logoDataUrl ? (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/6 p-3">
                    <img src={resolvedStyle.logoDataUrl} alt="Logo" className="h-10 w-10 rounded-lg border border-white/15 object-contain" />
                    <div className="flex-1 text-xs text-white/55">Logo embedded in QR center</div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/60 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400 transition"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/14 bg-white/4 px-4 py-3 transition hover:border-amber-500/40 hover:bg-amber-500/5">
                    <Icon name="PhotoIcon" size={20} variant="solid" className="text-white/35" />
                    <span className="text-sm text-white/50">
                      {isProcessingLogo ? 'Processing…' : 'Upload a logo image (PNG, JPG, SVG)'}
                    </span>
                    <input ref={logoFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isProcessingLogo} />
                  </label>
                )}
                {logoError ? <p className="mt-2 text-xs text-red-400">{logoError}</p> : null}
              </div>
            </div>

            {/* RIGHT — sticky live preview */}
            <div className="flex flex-col bg-[#0e1520] px-5 py-6 md:px-8 md:py-8">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400/70">Live preview</p>
              <p className="mb-5 text-sm text-white/40">Updates instantly as you configure.</p>

              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="relative">
                  {isGeneratingPreview && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#0e1520]/70">
                      <Icon name="ArrowPathIcon" size={20} variant="solid" className="animate-spin text-amber-400" />
                    </div>
                  )}
                  <StyledQrCode
                    data={activeValue}
                    qrCodeDataUrl={qrCodeDataUrl}
                    qrStyle={resolvedStyle}
                    size={200}
                    className="mx-auto"
                    imageClassName="rounded-2xl border border-white/10"
                  />
                </div>

                <div className="mt-5 w-full rounded-xl border border-white/8 bg-white/5 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">Destination</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-white/75">{activeValue}</p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloadState === 'downloading' || isGeneratingPreview}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-amber-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon name={downloadState === 'downloading' ? 'ArrowPathIcon' : 'ArrowDownTrayIcon'} size={17} variant="solid" className={downloadState === 'downloading' ? 'animate-spin' : ''} />
                  {downloadState === 'downloading' ? 'Preparing download…' : 'Download PNG'}
                </button>
                <button
                  type="button"
                  onClick={handleCopyGeneratorValue}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon name={copiedGeneratorValue ? 'CheckIcon' : 'DocumentDuplicateIcon'} size={16} variant="solid" className={copiedGeneratorValue ? 'text-emerald-400' : ''} />
                  {copiedGeneratorValue ? 'Copied to clipboard' : 'Copy destination text'}
                </button>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-white/30">High-quality PNG · Print and digital ready</p>
            </div>
          </div>
        ) : (
          /* ─── Scan: left upload + right result ─── */
          <div className="grid min-h-[540px] lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">

            {/* LEFT — upload panel */}
            <div className="border-r border-white/8 bg-[#141922] px-5 py-6 md:px-8 md:py-8">
              <h2 className="mb-1 text-2xl font-bold text-white md:text-3xl">Scan a QR code</h2>
              <p className="mb-6 text-sm leading-relaxed text-white/50">
                Upload a screenshot or image and LinkLab will extract the encoded URL or text right in your browser — no server upload needed.
              </p>

              <label
                htmlFor="scan-upload"
                className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/12 bg-white/4 p-6 text-center transition hover:border-amber-500/40 hover:bg-amber-500/5"
              >
                <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8 text-white/40">
                  <Icon name="ArrowUpTrayIcon" size={26} variant="solid" />
                </span>
                <span className="text-base font-semibold text-white/80">
                  {isScanning ? 'Scanning…' : 'Click to upload QR image'}
                </span>
                <span className="mt-1.5 max-w-[300px] text-xs leading-relaxed text-white/38">
                  PNG, JPG, WEBP, screenshots, camera photos — works as long as the QR code is clearly visible.
                </span>
                <span className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/65">
                  <Icon name="PhotoIcon" size={15} variant="solid" />
                  Browse files
                </span>
                <input
                  id="scan-upload"
                  ref={scanFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScanUpload}
                  disabled={isScanning}
                />
              </label>

              {scanError ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
                  <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mt-0.5 flex-shrink-0 text-red-400" />
                  {scanError}
                </div>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: 'PhotoIcon', text: 'Upload screenshots, PNGs, JPGs, or camera photos.' },
                  { icon: 'MagnifyingGlassIcon', text: 'Decodes entirely in your browser — nothing is uploaded.' },
                  { icon: 'ClipboardDocumentIcon', text: 'Copy the URL or open the link directly from the result.' },
                ].map((item) => (
                  <div key={item.text} className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                    <Icon name={item.icon as never} size={16} variant="solid" className="mb-2 text-amber-400/60" />
                    <p className="text-xs leading-relaxed text-white/50">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — scan result */}
            <div className="flex flex-col bg-[#0e1520] px-5 py-6 md:px-8 md:py-8">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400/70">Scan result</p>
              <p className="mb-5 text-sm text-white/40">Preview and decoded content appear here.</p>

              <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                {scanPreviewUrl ? (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white/60">Uploaded image</p>
                      <p className="max-w-[160px] truncate text-xs text-white/35">{scanFileName}</p>
                    </div>
                    <img
                      src={scanPreviewUrl}
                      alt="Uploaded QR code"
                      className="max-h-[180px] w-full rounded-xl border border-white/10 object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/4">
                    <p className="text-xs text-white/30">Uploaded image preview</p>
                  </div>
                )}

                <div className="rounded-xl border border-white/8 bg-white/4 p-3">
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">Decoded content</p>
                  <p className="min-h-[56px] break-all text-sm leading-relaxed text-white/70">
                    {isScanning
                      ? 'Reading QR code from image…'
                      : scanResult || 'Upload a QR code image to see the decoded URL or text here.'}
                  </p>
                </div>

                {scanResult ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleCopyScanValue}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      <Icon name={copiedScanValue ? 'CheckIcon' : 'DocumentDuplicateIcon'} size={14} variant="solid" className={copiedScanValue ? 'text-emerald-400' : ''} />
                      {copiedScanValue ? 'Copied' : 'Copy result'}
                    </button>
                    {scanResultIsUrl ? (
                      <a
                        href={scanResult}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-400"
                      >
                        <Icon name="ArrowTopRightOnSquareIcon" size={14} variant="solid" />
                        Open link
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-white/30">Browser-side decoding · No server upload · Instant results</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
