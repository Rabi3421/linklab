import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#1e2129',
          color: '#f5f5f0',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.22), transparent 34%), radial-gradient(circle at 82% 20%, rgba(99,102,241,0.18), transparent 32%), radial-gradient(circle at 58% 85%, rgba(239,68,68,0.14), transparent 36%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 46,
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 34,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '76px 86px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 46 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 52%, #ef4444 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              L
            </div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>LinkLab</div>
          </div>

          <div
            style={{
              fontSize: 68,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: 0,
              maxWidth: 850,
            }}
          >
            URL shortener, branded links, QR codes and analytics
          </div>

          <div
            style={{
              marginTop: 34,
              display: 'flex',
              gap: 14,
              color: 'rgba(245,245,240,0.68)',
              fontSize: 24,
            }}
          >
            <span>Custom links</span>
            <span style={{ color: 'rgba(245,158,11,0.8)' }}>|</span>
            <span>Click tracking</span>
            <span style={{ color: 'rgba(245,158,11,0.8)' }}>|</span>
            <span>Developer API</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
