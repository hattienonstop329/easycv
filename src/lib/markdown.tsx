import { Fragment, ReactNode } from 'react';

// Tiny inline markdown: **bold**, *italic*, `code`, [text](url).
// We deliberately avoid block features (no headings, no code blocks, no lists)
// to keep behavior predictable inside resume templates.

interface Token {
  kind: 'text' | 'bold' | 'italic' | 'code' | 'link';
  text: string;
  href?: string;
  children?: Token[];
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let buf = '';

  const flush = () => {
    if (buf) {
      tokens.push({ kind: 'text', text: buf });
      buf = '';
    }
  };

  while (i < input.length) {
    const rest = input.slice(i);

    // [text](url)
    const link = rest.match(/^\[([^\]]+)\]\(([^)\s]+)\)/);
    if (link) {
      flush();
      tokens.push({ kind: 'link', text: link[1], href: link[2], children: tokenize(link[1]) });
      i += link[0].length;
      continue;
    }

    // **bold**
    if (rest.startsWith('**')) {
      const end = rest.indexOf('**', 2);
      if (end > 2) {
        flush();
        const inner = rest.slice(2, end);
        tokens.push({ kind: 'bold', text: inner, children: tokenize(inner) });
        i += end + 2;
        continue;
      }
    }

    // *italic* (single asterisk, but not **)
    if (rest[0] === '*' && rest[1] !== '*') {
      const closer = rest.slice(1).search(/[^\\]\*/);
      if (closer >= 0) {
        const end = closer + 2; // index of closing *
        flush();
        const inner = rest.slice(1, end);
        tokens.push({ kind: 'italic', text: inner, children: tokenize(inner) });
        i += end + 1;
        continue;
      }
    }

    // `code`
    if (rest[0] === '`') {
      const end = rest.indexOf('`', 1);
      if (end > 1) {
        flush();
        tokens.push({ kind: 'code', text: rest.slice(1, end) });
        i += end + 1;
        continue;
      }
    }

    buf += input[i];
    i += 1;
  }

  flush();
  return tokens;
}

function renderTokens(tokens: Token[], keyPrefix = ''): ReactNode {
  return tokens.map((t, i) => {
    const key = `${keyPrefix}${i}`;
    switch (t.kind) {
      case 'text':
        return <Fragment key={key}>{t.text}</Fragment>;
      case 'bold':
        return <strong key={key}>{t.children ? renderTokens(t.children, `${key}-`) : t.text}</strong>;
      case 'italic':
        return <em key={key}>{t.children ? renderTokens(t.children, `${key}-`) : t.text}</em>;
      case 'code':
        return (
          <code
            key={key}
            style={{
              fontFamily: 'var(--font-jetbrains, ui-monospace, monospace)',
              background: 'color-mix(in srgb, currentColor 8%, transparent)',
              padding: '0 4px',
              borderRadius: 3,
              fontSize: '0.92em',
            }}
          >
            {t.text}
          </code>
        );
      case 'link':
        return (
          <a
            key={key}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent, currentColor)', textDecoration: 'underline' }}
          >
            {t.children ? renderTokens(t.children, `${key}-`) : t.text}
          </a>
        );
    }
  });
}

export function MD({ children }: { children: string | undefined | null }) {
  if (!children) return null;
  // Preserve newlines so multi-line summaries / bullets render correctly.
  const lines = children.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {renderTokens(tokenize(line))}
        </Fragment>
      ))}
    </>
  );
}
