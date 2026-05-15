import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'easycv — a resume that feels like you';
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
            'radial-gradient(circle at 80% 100%, #F6F1E8 0%, #FBF8F1 40%, #EFE7D6 100%)',
          padding: '72px 88px',
          color: '#2A331C',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#C77D7D', fontStyle: 'italic', marginBottom: 12, display: 'flex' }}>
          handcrafted resumes.
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span style={{ display: 'flex' }}>a resume that</span>
          <span style={{ color: '#5D6E42', fontStyle: 'italic', display: 'flex' }}>
            feels like you.
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
          <div style={{ fontSize: 22, color: '#6B5D50', display: 'flex' }}>
            12 templates · drag-and-drop · no signup, no cloud
          </div>
          <div
            style={{
              fontSize: 64,
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
