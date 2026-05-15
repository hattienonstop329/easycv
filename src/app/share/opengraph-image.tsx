import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'easycv — a shared resume';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'radial-gradient(circle at 20% 0%, #F6F1E8 0%, #FBF8F1 40%, #EFE7D6 100%)',
          padding: '64px 80px',
          color: '#2A331C',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: '#C77D7D',
            fontStyle: 'italic',
            marginBottom: 8,
            display: 'flex',
          }}
        >
          shared via easycv.
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span style={{ display: 'flex' }}>a resume</span>
          <span style={{ color: '#5D6E42', fontStyle: 'italic', display: 'flex' }}>
            worth opening.
          </span>
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontSize: 22, color: '#6B5D50', display: 'flex' }}>
              click to view, then edit a copy to make it yours.
            </div>
            <div
              style={{
                fontSize: 18,
                color: '#6B5D50',
                display: 'flex',
                gap: 14,
              }}
            >
              <span style={{ display: 'flex' }}>no signup</span>
              <span>·</span>
              <span style={{ display: 'flex' }}>no cloud</span>
              <span>·</span>
              <span style={{ display: 'flex' }}>all local</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 56,
              color: '#3D4A2A',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              display: 'flex',
            }}
          >
            <span>easy</span>
            <span style={{ color: '#C77D7D' }}>cv</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
