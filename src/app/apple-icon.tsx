import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// iOS / Android home-screen icon: paper-warm card with a big serif "e" and a
// strawberry "wax-seal" dot in the corner. Matches the brand mark in the nav.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FBF8F1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Inner olive panel with the wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 132,
            height: 132,
            borderRadius: 28,
            background: '#3D4A2A',
            boxShadow: '0 6px 18px rgba(42, 51, 28, 0.25)',
            position: 'relative',
          }}
        >
          <span
            style={{
              display: 'flex',
              color: '#FBF8F1',
              fontFamily: 'serif',
              fontSize: 110,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              marginTop: -8,
            }}
          >
            e
          </span>
          {/* Strawberry "wax seal" dot */}
          <span
            style={{
              display: 'flex',
              position: 'absolute',
              top: 14,
              right: 14,
              width: 22,
              height: 22,
              borderRadius: 999,
              background: '#C77D7D',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          />
        </div>

        {/* Tiny brand label below the panel */}
        <span
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 14,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: 'serif',
            fontSize: 13,
            color: '#6B5D50',
            letterSpacing: '0.06em',
            justifyContent: 'center',
          }}
        >
          easycv
        </span>
      </div>
    ),
    { ...size },
  );
}
