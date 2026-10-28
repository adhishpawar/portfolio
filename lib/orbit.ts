export interface OrbitSegment {
  id: string;
  start: number;
  end: number;
}

// Splits the scroll range [0, 1] into one contiguous segment per chapter.
// A chapter's share is its weight (default 1); non-positive weights count as 1
// so a bad value can never collapse a chapter to nothing.
export function computeOrbitSegments(
  ids: string[],
  weights: Record<string, number> = {},
): OrbitSegment[] {
  if (ids.length === 0) return [];
  const shares = ids.map((id) => (weights[id] > 0 ? weights[id] : 1));
  const total = shares.reduce((sum, share) => sum + share, 0);

  let cursor = 0;
  return ids.map((id, i) => {
    const start = cursor;
    cursor += shares[i] / total;
    return { id, start, end: i === ids.length - 1 ? 1 : cursor };
  });
}
