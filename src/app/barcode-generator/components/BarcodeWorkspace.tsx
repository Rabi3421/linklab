'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

// ── Barcode format definitions ─────────────────────────────────────────────

interface BarcodeFormat {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  example: string;
  hint: string;
}

const BARCODE_FORMATS: BarcodeFormat[] = [
  {
    id: 'CODE128',
    label: 'Code 128',
    description: 'Universal — text, numbers, alphanumeric',
    placeholder: 'Enter any text or numbers',
    example: 'LINKLAB-2024',
    hint: 'Supports letters, digits, and common symbols.',
  },
  {
    id: 'EAN13',
    label: 'EAN-13',
    description: 'Retail products — 12 digits (check digit auto-added)',
    placeholder: 'Enter 12 or 13 digits',
    example: '590123412345',
    hint: 'Enter exactly 12 digits. The 13th check digit is added automatically.',
  },
  {
    id: 'EAN8',
    label: 'EAN-8',
    description: 'Small retail products — 7 digits',
    placeholder: 'Enter 7 or 8 digits',
    example: '9638507',
    hint: 'Enter exactly 7 digits. The 8th check digit is added automatically.',
  },
  {
    id: 'UPC',
    label: 'UPC-A',
    description: 'US retail — 11 digits',
    placeholder: 'Enter 11 or 12 digits',
    example: '01234567890',
    hint: 'Enter exactly 11 digits. The 12th check digit is added automatically.',
  },
  {
    id: 'CODE39',
    label: 'Code 39',
    description: 'Industrial & logistics — uppercase alphanumeric',
    placeholder: 'Enter uppercase letters and digits',
    example: 'LINKLAB-001',
    hint: 'Supports A–Z, 0–9, and symbols: - . $ / + % space.',
  },
  {
    id: 'ITF14',
    label: 'ITF-14',
    description: 'Shipping & wholesale — 13 digits',
    placeholder: 'Enter 13 or 14 digits',
    example: '0614141123452',
    hint: 'Enter exactly 13 digits. Used for carton/pallet-level barcodes.',
  },
  {
    id: 'MSI',
    label: 'MSI / Plessey',
    description: 'Warehouse inventory — digits only',
    placeholder: 'Enter digits only',
    example: '1234567',
    hint: 'Used in warehouse and inventory systems. Digits only.',
  },
  {
    id: 'pharmacode',
    label: 'Pharmacode',
    description: 'Pharmaceutical packaging — number 3–131070',
    placeholder: 'Enter a number between 3 and 131070',
    example: '1234',
    hint: 'Used on pharmaceutical packaging. Enter a number between 3 and 131070.',
  },
];

const DEFAULT_FORMAT = BARCODE_FORMATS[0];

// ── Color presets ─────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { label: 'Classic Black', fg: '#000000', bg: '#FFFFFF' },
  { label: 'Navy & White', fg: '#1e3a5f', bg: '#FFFFFF' },
  { label: 'Dark on Amber', fg: '#1a1a1a', bg: '#fbbf24' },
  { label: 'White on Dark', fg: '#FFFFFF', bg: '#1e2129' },
  { label: 'Forest Green', fg: '#15803d', bg: '#f0fdf4' },
  { label: 'Indigo Pro', fg: '#4338ca', bg: '#eef2ff' },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function loadJsBarcodeScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).JsBarcode) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load barcode library'));
    document.head.appendChild(s);
  });
}

// ── Component ─────────────────────────────────────────────────────────────

export default function BarcodeWorkspace() {
  const [format, setFormat] = useState<BarcodeFormat>(DEFAULT_FORMAT);
  const [value, setValue] = useState(DEFAULT_FORMAT.example);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [showText, setShowText] = useState(true);
  const [lineWidth, setLineWidth] = useState(2);
  const [barcodeHeight, setBarcodeHeight] = useState(100);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Load JsBarcode on mount
  useEffect(() => {
    loadJsBarcodeScript()
      .then(() => setIsReady(true))
      .catch(() => setError('Failed to load barcode engine. Please refresh.'));
  }, []);

  // Regenerate barcode whenever inputs change
  useEffect(() => {
    if (!isReady || !svgRef.current) return;
    setError('');

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const JsBarcode = (window as any).JsBarcode;
      JsBarcode(svgRef.current, value || format.example, {
        format: format.id,
        lineColor: fgColor,
        background: bgColor,
        displayValue: showText,
        width: lineWidth,
        height: barcodeHeight,
        margin: 16,
        fontSize: 14,
        fontOptions: '',
        font: 'monospace',
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 4,
        valid: (isValid: boolean) => {
          if (!isValid) {
            setError(`"${value}" is not valid for ${format.label}. ${format.hint}`);
          }
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : `Invalid value for ${format.label}.`);
    }
  }, [isReady, value, format, fgColor, bgColor, showText, lineWidth, barcodeHeight]);

  const handleFormatChange = useCallback((f: BarcodeFormat) => {
    setFormat(f);
    setValue(f.example);
    setError('');
  }, []);

  const handlePreset = useCallback((preset: (typeof COLOR_PRESETS)[0]) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
  }, []);

  const handleDownload = useCallback(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });

    // Convert SVG to PNG via canvas
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const scale = 3;
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `linklab-barcode-${format.id.toLowerCase()}-${Date.now()}.png`;
      a.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    };
    img.src = url;
  }, [format]);

  const handleDownloadSvg = useCallback(() => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linklab-barcode-${format.id.toLowerCase()}-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [format]);

  return (
    <div
      className="rounded-[24px] overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
        border: '1px solid rgba(200,205,220,0.12)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="flex flex-col lg:flex-row min-h-[520px]">

        {/* ── Left: Controls ── */}
        <div
          className="lg:w-[480px] shrink-0 p-6 lg:p-8 space-y-6 overflow-y-auto"
          style={{ borderRight: '1px solid rgba(200,205,220,0.08)' }}
        >
          {/* Barcode value input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/50 mb-2">
              Barcode content
            </label>
            <textarea
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
              placeholder={format.placeholder}
              rows={2}
              className="w-full rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(200,205,220,0.12)',
              }}
            />
            {error ? (
              <p className="mt-1.5 text-xs text-red-400 leading-relaxed">{error}</p>
            ) : (
              <p className="mt-1.5 text-xs text-white/30">{format.hint}</p>
            )}
          </div>

          {/* Format selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/50 mb-3">
              Barcode format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BARCODE_FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFormatChange(f)}
                  className="text-left rounded-xl px-3 py-2.5 transition-all duration-150"
                  style={{
                    background: format.id === f.id
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.14) 100%)'
                      : 'rgba(255,255,255,0.04)',
                    border: format.id === f.id
                      ? '1px solid rgba(99,102,241,0.40)'
                      : '1px solid rgba(200,205,220,0.08)',
                  }}
                >
                  <p className={`text-xs font-semibold ${format.id === f.id ? 'text-indigo-300' : 'text-white/70'}`}>{f.label}</p>
                  <p className="text-[10px] text-white/35 mt-0.5 leading-tight">{f.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color presets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/50 mb-3">
              Color preset
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePreset(p)}
                  title={p.label}
                  className="w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110"
                  style={{
                    background: p.fg,
                    borderColor: (fgColor === p.fg && bgColor === p.bg) ? '#6366f1' : 'rgba(200,205,220,0.18)',
                    boxShadow: `inset 0 0 0 2px ${p.bg}`,
                  }}
                />
              ))}
            </div>

            {/* Custom colors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-white/40 mb-1.5">Bar color</p>
                <label
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.10)' }}
                >
                  <span className="w-5 h-5 rounded-md shrink-0" style={{ background: fgColor, border: '1px solid rgba(200,205,220,0.20)' }} />
                  <span className="font-mono text-xs text-white/60">{fgColor.toUpperCase()}</span>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="sr-only" />
                </label>
              </div>
              <div>
                <p className="text-[11px] text-white/40 mb-1.5">Background</p>
                <label
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.10)' }}
                >
                  <span className="w-5 h-5 rounded-md shrink-0" style={{ background: bgColor, border: '1px solid rgba(200,205,220,0.20)' }} />
                  <span className="font-mono text-xs text-white/60">{bgColor.toUpperCase()}</span>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="sr-only" />
                </label>
              </div>
            </div>
          </div>

          {/* Size controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">Bar width: {lineWidth}px</label>
              <input
                type="range" min={1} max={4} step={0.5} value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">Height: {barcodeHeight}px</label>
              <input
                type="range" min={40} max={200} step={10} value={barcodeHeight}
                onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

          {/* Show text toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white/70">Show value below barcode</p>
              <p className="text-xs text-white/35 mt-0.5">Display the encoded text under the bars</p>
            </div>
            <button
              type="button"
              onClick={() => setShowText((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200 ${showText ? 'bg-indigo-500 border-indigo-500' : 'bg-white/10 border-white/10'}`}
            >
              <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${showText ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* ── Right: Preview + download ── */}
        <div className="flex-1 flex flex-col p-6 lg:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-400">Live preview</p>
              <p className="text-xs text-white/35 mt-0.5">Updates as you type</p>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-indigo-200"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.22)' }}
            >
              {format.label}
            </span>
          </div>

          {/* SVG preview area */}
          <div
            className="flex-1 flex items-center justify-center rounded-2xl mb-6 min-h-[200px] relative overflow-hidden"
            style={{ background: bgColor, border: '1px solid rgba(200,205,220,0.10)' }}
          >
            {!isReady && (
              <div className="flex flex-col items-center gap-2 text-white/30">
                <div className="w-6 h-6 border-2 border-white/20 border-t-indigo-400 rounded-full animate-spin" />
                <p className="text-xs">Loading barcode engine…</p>
              </div>
            )}
            <svg
              ref={svgRef}
              className={isReady ? 'block' : 'invisible'}
              style={{ maxWidth: '100%', maxHeight: '280px' }}
            />
          </div>

          {/* Format info */}
          <div
            className="rounded-xl px-4 py-3 mb-5 text-xs"
            style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}
          >
            <p className="text-white/50 leading-relaxed">
              <span className="text-indigo-300 font-semibold">{format.label}</span> · {format.description}
            </p>
          </div>

          {/* Download buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!!error || !isReady}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-body text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{
                background: downloaded
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              }}
            >
              <Icon name={downloaded ? 'CheckIcon' : 'ArrowDownTrayIcon'} size={16} variant="solid" />
              {downloaded ? 'Downloaded!' : 'Download PNG'}
            </button>
            <button
              type="button"
              onClick={handleDownloadSvg}
              disabled={!!error || !isReady}
              className="flex items-center gap-2 rounded-xl px-4 py-3 font-body text-sm font-semibold text-indigo-300 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)' }}
            >
              <Icon name="ArrowDownTrayIcon" size={16} variant="outline" />
              SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
