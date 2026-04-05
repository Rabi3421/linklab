'use client';

import type { QrStyleConfig } from './types';
import { resolveQrStyleConfig } from './qr-style';

type DownloadExtension = 'png' | 'jpeg' | 'webp' | 'svg';

interface QrCodeStylingInstance {
  append: (element: HTMLElement) => void;
  download: (options: { name: string; extension: DownloadExtension }) => Promise<void> | void;
}

interface CreateStyledQrCodeInput {
  data: string;
  size?: number;
  style?: QrStyleConfig;
}

let qrCodeStylingConstructorPromise: Promise<any> | null = null;

const loadQrCodeStyling = async () => {
  if (!qrCodeStylingConstructorPromise) {
    qrCodeStylingConstructorPromise = import('qr-code-styling').then((module) => module.default || module);
  }

  return qrCodeStylingConstructorPromise;
};

export const getStyledQrOptions = ({ data, size = 180, style }: CreateStyledQrCodeInput) => {
  const resolvedStyle = resolveQrStyleConfig(style);

  return {
    width: size,
    height: size,
    type: 'svg',
    shape: 'square',
    data,
    image: resolvedStyle.logoDataUrl,
    margin: resolvedStyle.frameStyle === 'outline' ? 10 : 6,
    qrOptions: {
      errorCorrectionLevel: 'Q',
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.3,
      margin: 8,
      saveAsBlob: false,
    },
    dotsOptions: {
      color: resolvedStyle.foregroundColor,
      type: resolvedStyle.dotStyle,
    },
    cornersSquareOptions: {
      color: resolvedStyle.cornerColor,
      type: resolvedStyle.cornerStyle,
    },
    cornersDotOptions: {
      color: resolvedStyle.cornerColor,
      type: resolvedStyle.cornerStyle,
    },
    backgroundOptions: {
      color: resolvedStyle.backgroundColor,
    },
  };
};

export const createStyledQrCode = async ({ data, size, style }: CreateStyledQrCodeInput): Promise<QrCodeStylingInstance> => {
  const QRCodeStyling = await loadQrCodeStyling();
  return new QRCodeStyling(getStyledQrOptions({ data, size, style }));
};

export const downloadStyledQrCode = async ({
  data,
  size,
  style,
  name,
  extension,
}: CreateStyledQrCodeInput & { name: string; extension: DownloadExtension }) => {
  const qrCode = await createStyledQrCode({ data, size, style });
  await qrCode.download({ name, extension: extension || 'png' });
};
