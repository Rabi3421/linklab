import { useId } from 'react';

type BrandLogoSize = 'sm' | 'md' | 'lg';

interface BrandLogoProps {
  size?: BrandLogoSize;
  showWordmark?: boolean;
  className?: string;
  labelClassName?: string;
}

const sizeClasses: Record<BrandLogoSize, { icon: string; text: string; gap: string }> = {
  sm: {
    icon: 'h-8 w-8',
    text: 'text-lg',
    gap: 'gap-2.5',
  },
  md: {
    icon: 'h-9 w-9',
    text: 'text-xl',
    gap: 'gap-3',
  },
  lg: {
    icon: 'h-11 w-11',
    text: 'text-2xl',
    gap: 'gap-3.5',
  },
};

export default function BrandLogo({
  size = 'md',
  showWordmark = true,
  className = '',
  labelClassName = 'text-foreground',
}: BrandLogoProps) {
  const { icon, text, gap } = sizeClasses[size];
  const gradientId = useId().replace(/:/g, '');
  const accentId = useId().replace(/:/g, '');

  return (
    <span className={`inline-flex items-center ${gap} ${className}`.trim()}>
      <span className={`relative inline-flex shrink-0 items-center justify-center ${icon}`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <defs>
            <linearGradient id={gradientId} x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="0.52" stopColor="#F97316" />
              <stop offset="1" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id={accentId} x1="15" y1="10" x2="29" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="1" stopColor="#FDBA74" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="36" height="36" rx="12" fill={`url(#${gradientId})`} />
          <rect x="2.75" y="2.75" width="34.5" height="34.5" rx="11.25" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          <rect x="11.1" y="18.2" width="10.6" height="15.2" rx="5.3" transform="rotate(-45 11.1 18.2)" stroke="white" strokeWidth="2.4" />
          <rect x="18.9" y="10.4" width="10.6" height="15.2" rx="5.3" transform="rotate(-45 18.9 10.4)" stroke="white" strokeWidth="2.4" />
          <path d="M15.2 24.8L24.8 15.2" stroke={`url(#${accentId})`} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="28.8" cy="11.2" r="2.4" fill={`url(#${accentId})`} />
        </svg>
        <span
          className="pointer-events-none absolute inset-[1px] rounded-[11px]"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 38%)',
          }}
        />
      </span>

      {showWordmark ? (
        <span className={`font-heading font-semibold tracking-[-0.03em] ${text}`}>
          <span className={labelClassName}>Link</span>
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #fb7185 100%)' }}
          >
            Lab
          </span>
        </span>
      ) : (
        <span className="sr-only">LinkLab</span>
      )}
    </span>
  );
}
