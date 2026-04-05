import type { QrCornerStyle, QrDotsStyle, QrFrameStyle, QrStyleConfig } from './types';

export const QR_DOT_STYLES: QrDotsStyle[] = [
  'rounded',
  'dots',
  'classy',
  'classy-rounded',
  'square',
  'extra-rounded',
];

export const QR_CORNER_STYLES: QrCornerStyle[] = [
  'extra-rounded',
  'rounded',
  'classy-rounded',
  'classy',
  'square',
  'dots',
  'dot',
];

export const QR_FRAME_STYLES: QrFrameStyle[] = ['soft', 'glass', 'outline'];
export const QR_LOGO_MAX_BYTES = 350 * 1024;

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const IMAGE_DATA_URL_PATTERN = /^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,[a-z0-9+/=\s]+$/i;

export const QR_STYLE_PRESETS: Array<{
  id: string;
  name: string;
  description: string;
  config: QrStyleConfig;
}> = [
  {
    id: 'brand-sunset',
    name: 'Brand Sunset',
    description: 'Warm amber branding with rounded dots for landing pages and event QR codes.',
    config: {
      presetId: 'brand-sunset',
      foregroundColor: '#f97316',
      backgroundColor: '#f5f5f0',
      cornerColor: '#f59e0b',
      dotStyle: 'rounded',
      cornerStyle: 'extra-rounded',
      frameStyle: 'soft',
      logoDataUrl: undefined,
    },
  },
  {
    id: 'slate-pro',
    name: 'Slate Pro',
    description: 'High-contrast slate styling that feels clean in docs, menus, and packaging.',
    config: {
      presetId: 'slate-pro',
      foregroundColor: '#1f2937',
      backgroundColor: '#f8fafc',
      cornerColor: '#475569',
      dotStyle: 'classy-rounded',
      cornerStyle: 'rounded',
      frameStyle: 'outline',
      logoDataUrl: undefined,
    },
  },
  {
    id: 'ocean-glow',
    name: 'Ocean Glow',
    description: 'Blue-forward styling for SaaS campaigns, app downloads, and developer docs.',
    config: {
      presetId: 'ocean-glow',
      foregroundColor: '#2563eb',
      backgroundColor: '#eff6ff',
      cornerColor: '#0f172a',
      dotStyle: 'dots',
      cornerStyle: 'classy-rounded',
      frameStyle: 'glass',
      logoDataUrl: undefined,
    },
  },
  {
    id: 'emerald-pop',
    name: 'Emerald Pop',
    description: 'Bright commerce-friendly styling that stands out in storefronts and WhatsApp flyers.',
    config: {
      presetId: 'emerald-pop',
      foregroundColor: '#059669',
      backgroundColor: '#ecfdf5',
      cornerColor: '#065f46',
      dotStyle: 'extra-rounded',
      cornerStyle: 'dot',
      frameStyle: 'soft',
      logoDataUrl: undefined,
    },
  },
];

export const DEFAULT_QR_STYLE = QR_STYLE_PRESETS[0].config;

const isValidHexColor = (value?: string) => Boolean(value && HEX_COLOR_PATTERN.test(value));

const getDataUrlPayloadBytes = (value: string) => {
  const [, base64Payload = ''] = value.split(',', 2);
  const normalized = base64Payload.replace(/\s+/g, '');
  const padding = normalized.endsWith('==') ? 2 : normalized.endsWith('=') ? 1 : 0;
  return Math.floor((normalized.length * 3) / 4) - padding;
};

export const isValidQrLogoDataUrl = (value?: string) => {
  if (!value) {
    return false;
  }

  if (!IMAGE_DATA_URL_PATTERN.test(value)) {
    return false;
  }

  return getDataUrlPayloadBytes(value) <= QR_LOGO_MAX_BYTES;
};

export const resolveQrStyleConfig = (input?: Partial<QrStyleConfig> | null): QrStyleConfig => {
  const preset = QR_STYLE_PRESETS.find((item) => item.id === input?.presetId) || QR_STYLE_PRESETS[0];

  return {
    presetId: preset.id,
    foregroundColor: isValidHexColor(input?.foregroundColor) ? input!.foregroundColor! : preset.config.foregroundColor,
    backgroundColor: isValidHexColor(input?.backgroundColor) ? input!.backgroundColor! : preset.config.backgroundColor,
    cornerColor: isValidHexColor(input?.cornerColor) ? input!.cornerColor! : preset.config.cornerColor,
    dotStyle: input?.dotStyle && QR_DOT_STYLES.includes(input.dotStyle) ? input.dotStyle : preset.config.dotStyle,
    cornerStyle: input?.cornerStyle && QR_CORNER_STYLES.includes(input.cornerStyle) ? input.cornerStyle : preset.config.cornerStyle,
    frameStyle: input?.frameStyle && QR_FRAME_STYLES.includes(input.frameStyle) ? input.frameStyle : preset.config.frameStyle,
    logoDataUrl: isValidQrLogoDataUrl(input?.logoDataUrl) ? input?.logoDataUrl : undefined,
  };
};

export const getQrPreset = (presetId?: string) => {
  return QR_STYLE_PRESETS.find((preset) => preset.id === presetId) || QR_STYLE_PRESETS[0];
};
