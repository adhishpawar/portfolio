export interface EmphasisSegment {
  text: string;
  em: boolean;
}

// *word* marks emphasis. A marker needs a non-space right after the opener and
// right before the closer, so "2 * 3" and an unclosed "*open" stay literal.
const MARKED = /\*(?=\S)([^*]*\S)\*/g;

export function parseEmphasis(text: string): EmphasisSegment[] {
  const segments: EmphasisSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(MARKED)) {
    if (match.index > last) segments.push({ text: text.slice(last, match.index), em: false });
    segments.push({ text: match[1], em: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), em: false });
  return segments;
}
