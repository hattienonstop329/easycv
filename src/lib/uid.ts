// Short non-cryptographic id for client-side records (sections, items,
// snapshots). 8 chars of base36 randomness — plenty for a local document.
export const uid = (): string => Math.random().toString(36).slice(2, 10);
