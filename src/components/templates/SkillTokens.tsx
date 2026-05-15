import { CSSProperties, Fragment, ReactNode } from 'react';
import { SkillItem } from '@/lib/types';

export function Dots({
  level,
  size = 6,
  color = 'currentColor',
  spacing = 2,
}: {
  level: number;
  size?: number;
  color?: string;
  spacing?: number;
}) {
  return (
    <span
      aria-label={`level ${level} of 5`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing,
        marginLeft: 4,
        verticalAlign: 'middle',
      }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: n <= level ? color : 'transparent',
            border: `1px solid ${color}`,
            display: 'inline-block',
            opacity: n <= level ? 1 : 0.4,
          }}
        />
      ))}
    </span>
  );
}

export function SkillTokens({
  items,
  separator = ' · ',
  showDots = true,
  dotSize = 6,
  dotColor,
}: {
  items: SkillItem[];
  separator?: ReactNode;
  showDots?: boolean;
  dotSize?: number;
  dotColor?: string;
}) {
  return (
    <>
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <span>{separator}</span>}
          <span style={{ whiteSpace: 'nowrap' as CSSProperties['whiteSpace'] }}>
            {it.name}
            {showDots && it.level && (
              <Dots level={it.level} size={dotSize} color={dotColor ?? 'currentColor'} />
            )}
          </span>
        </Fragment>
      ))}
    </>
  );
}

export function joinSkillNames(items: SkillItem[], sep = ', '): string {
  return items.map((i) => i.name).join(sep);
}
