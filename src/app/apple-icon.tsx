import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 52%, #ef4444 100%)',
          borderRadius: 44,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 6,
            borderRadius: 38,
            border: '4px solid rgba(255,255,255,0.18)',
          }}
        />
        <svg width="104" height="104" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="accent" x1="15" y1="10" x2="29" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF3C7" />
              <stop offset="1" stopColor="#FFEDD5" />
            </linearGradient>
          </defs>
          <rect x="11.1" y="18.2" width="10.6" height="15.2" rx="5.3" transform="rotate(-45 11.1 18.2)" stroke="white" strokeWidth="2.5" />
          <rect x="18.9" y="10.4" width="10.6" height="15.2" rx="5.3" transform="rotate(-45 18.9 10.4)" stroke="white" strokeWidth="2.5" />
          <path d="M15.2 24.8L24.8 15.2" stroke="url(#accent)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="28.8" cy="11.2" r="2.4" fill="url(#accent)" />
        </svg>
      </div>
    ),
    size,
  );
}
