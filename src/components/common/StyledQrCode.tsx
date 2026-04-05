'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { resolveQrStyleConfig } from '@/lib/links/qr-style';
import { createStyledQrCode } from '@/lib/links/qr-style-client';
import type { QrStyleConfig } from '@/lib/links/types';

interface StyledQrCodeProps {
  data: string;
  qrCodeDataUrl: string;
  qrStyle?: QrStyleConfig;
  size?: number;
  className?: string;
  imageClassName?: string;
}

export default function StyledQrCode({
  data,
  qrCodeDataUrl,
  qrStyle,
  size = 160,
  className = '',
  imageClassName = '',
}: StyledQrCodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderMode, setRenderMode] = useState<'styled' | 'fallback'>(qrStyle ? 'styled' : 'fallback');
  const resolvedStyle = useMemo(() => (qrStyle ? resolveQrStyleConfig(qrStyle) : null), [qrStyle]);
  const styleSignature = useMemo(
    () => [
      resolvedStyle?.presetId || '',
      resolvedStyle?.foregroundColor || '',
      resolvedStyle?.backgroundColor || '',
      resolvedStyle?.cornerColor || '',
      resolvedStyle?.dotStyle || '',
      resolvedStyle?.cornerStyle || '',
      resolvedStyle?.frameStyle || '',
      resolvedStyle?.logoDataUrl || '',
    ].join('|'),
    [resolvedStyle],
  );

  useEffect(() => {
    if (!qrStyle) {
      setRenderMode('fallback');
      return undefined;
    }

    setRenderMode('styled');

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    let isCancelled = false;

    const renderStyledQr = async () => {
      try {
        const qrCode = await createStyledQrCode({ data, size, style: resolvedStyle || qrStyle });

        if (isCancelled || !containerRef.current) {
          return;
        }

        containerRef.current.innerHTML = '';
        qrCode.append(containerRef.current);
        setRenderMode('styled');
      } catch {
        if (!isCancelled) {
          setRenderMode('fallback');
        }
      }
    };

    const frame = window.requestAnimationFrame(() => {
      renderStyledQr();
    });

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(frame);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [data, qrStyle, resolvedStyle, size, styleSignature]);

  const wrapperClasses = resolvedStyle?.frameStyle === 'glass'
    ? 'bg-white/70 shadow-lg shadow-black/10 backdrop-blur'
    : resolvedStyle?.frameStyle === 'outline'
      ? 'bg-transparent ring-1 ring-border'
      : 'bg-card shadow-sm';

  return (
    <div className={`flex items-center justify-center rounded-2xl border border-border p-3 ${wrapperClasses} ${className}`}>
      {renderMode === 'styled' && qrStyle ? (
        <div
          ref={containerRef}
          className="flex h-full w-full items-center justify-center [&>canvas]:h-full [&>canvas]:w-full [&>svg]:h-full [&>svg]:w-full"
          style={{ width: size, height: size }}
        />
      ) : (
        <img
          src={qrCodeDataUrl}
          alt={`QR code for ${data}`}
          className={`rounded-xl ${imageClassName}`}
          style={{ width: size, height: size }}
        />
      )}
    </div>
  );
}
