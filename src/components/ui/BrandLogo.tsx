import Image from 'next/image';

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

  return (
    <span className={`inline-flex items-center ${gap} ${className}`.trim()}>
      <span className={`relative inline-flex shrink-0 items-center justify-center ${icon}`}>
        <Image
          src="/assets/brand/linklab-logo-mark.png"
          alt=""
          width={512}
          height={512}
          className="h-full w-full object-contain"
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
