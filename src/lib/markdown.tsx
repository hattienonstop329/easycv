import { Fragment, ReactNode } from 'react';

// Tiny inline markdown: **bold**, *italic*, `code`, [text](url).
// We deliberately avoid block features (no headings, no code blocks, no lists)
// to keep behavior predictable inside resume templates.
//
// Layout directives (resume-specific):
//   [br]              — forced line break (sugar for \n)
//   [indent]...       — render line with extra left padding
//   [keep]...[/keep]  — wrap content in a no-page-break span (print only)

interface Token {
  kind: 'text' | 'bold' | 'italic' | 'code' | 'link';
  text: string;
  href?: string;
  children?: Token[];
}

// Resume data round-trips through share-link URL hashes, so a hostile resume
// could embed `[text](javascript:…)`. React doesn't strip those, so we gate
// hrefs to a small allowlist of safe schemes before rendering as <a>.
const SAFE_HREF = /^(https?:|mailto:|tel:|\/|\.{1,2}\/|#)/i;
const isSafeHref = (href: string | undefined): href is string =>
  typeof href === 'string' && SAFE_HREF.test(href.trim());

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
      case 'link': {
        const children = t.children ? renderTokens(t.children, `${key}-`) : t.text;
        if (!isSafeHref(t.href)) {
          return <Fragment key={key}>{children}</Fragment>;
        }
        return (
          <a
            key={key}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent, currentColor)', textDecoration: 'underline' }}
          >
            {children}
          </a>
        );
      }
    }
  });
}

export function MD({ children }: { children: string | undefined | null }) {
  if (!children) return null;
  // Layout directives — preprocess before line splitting.
  const normalized = children.replace(/\[br\]/gi, '\n');
  const lines = normalized.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        const indented = /^\[indent\]/i.test(line);
        const stripped = indented ? line.replace(/^\[indent\]/i, '') : line;
        // [keep]...[/keep] wraps a span with no-page-break styling.
        const segments = splitOnKeep(stripped);
        const rendered = segments.map((seg, sIdx) =>
          seg.kind === 'keep' ? (
            <span
              key={sIdx}
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid', display: 'inline-block' }}
            >
              {renderTokens(tokenize(seg.text))}
            </span>
          ) : (
            <Fragment key={sIdx}>{renderTokens(tokenize(seg.text))}</Fragment>
          ),
        );
        return (
          <Fragment key={i}>
            {i > 0 && <br />}
            {indented ? (
              <span style={{ display: 'inline-block', paddingLeft: 16 }}>{rendered}</span>
            ) : (
              rendered
            )}
          </Fragment>
        );
      })}
    </>
  );
}

function splitOnKeep(text: string): { kind: 'plain' | 'keep'; text: string }[] {
  const out: { kind: 'plain' | 'keep'; text: string }[] = [];
  const re = /\[keep\]([\s\S]*?)\[\/keep\]/gi;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) out.push({ kind: 'plain', text: text.slice(lastIndex, m.index) });
    out.push({ kind: 'keep', text: m[1] });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) out.push({ kind: 'plain', text: text.slice(lastIndex) });
  return out;
}
