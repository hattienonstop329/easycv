import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Browser-tab favicon: olive rounded square with a cream "e" + strawberry dot.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#3D4A2A',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            display: 'flex',
            color: '#FBF8F1',
            fontFamily: 'serif',
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginTop: -2,
          }}
        >
          e
        </span>
        <span
          style={{
            display: 'flex',
            position: 'absolute',
            top: 4,
            right: 4,
            width: 7,
            height: 7,
            borderRadius: 999,
            background: '#C77D7D',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
