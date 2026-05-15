export interface DiffPart {
  kind: 'same' | 'add' | 'remove';
  text: string;
}

/**
 * Word-level diff between two strings using a simple LCS table.
 * Returns a flat list of segments tagged same/add/remove for inline rendering.
 *
 * Tokens preserve their trailing whitespace so we can join the result back
 * into something that reads naturally. Punctuation sticks to its word.
 */
export function diffWords(a: string, b: string): DiffPart[] {
  const aTokens = tokenize(a);
  const bTokens = tokenize(b);

  // Bail out: if one side is empty, the answer is trivially all-add or all-remove.
  if (aTokens.length === 0) return bTokens.length === 0 ? [] : [{ kind: 'add', text: b }];
  if (bTokens.length === 0) return [{ kind: 'remove', text: a }];

  // Cap the dynamic programming table so a pathological input can't lock the UI.
  const MAX = 400;
  if (aTokens.length > MAX || bTokens.length > MAX) {
    return [
      { kind: 'remove', text: a },
      { kind: 'add', text: b },
    ];
  }

  // Build LCS table
  const m = aTokens.length;
  const n = bTokens.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aTokens[i - 1].normalized === bTokens[j - 1].normalized) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Walk back to produce the segment list
  const out: DiffPart[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (aTokens[i - 1].normalized === bTokens[j - 1].normalized) {
      pushPart(out, 'same', bTokens[j - 1].raw);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      pushPart(out, 'remove', aTokens[i - 1].raw);
      i--;
    } else {
      pushPart(out, 'add', bTokens[j - 1].raw);
      j--;
    }
  }
  while (i > 0) {
    pushPart(out, 'remove', aTokens[--i].raw);
  }
  while (j > 0) {
    pushPart(out, 'add', bTokens[--j].raw);
  }

  return out.reverse();
}

interface Token {
  raw: string;
  normalized: string;
}

function tokenize(s: string): Token[] {
  // Split on whitespace, keep words + their trailing whitespace.
  const tokens: Token[] = [];
  const re = /\S+\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    tokens.push({ raw: m[0], normalized: m[0].trim().toLowerCase() });
  }
  return tokens;
}

function pushPart(parts: DiffPart[], kind: DiffPart['kind'], text: string): void {
  // Coalesce adjacent same-kind segments so the rendered output isn't fragmented.
  const last = parts[parts.length - 1];
  if (last && last.kind === kind) {
    last.text = text + last.text;
    return;
  }
  parts.push({ kind, text });
}
