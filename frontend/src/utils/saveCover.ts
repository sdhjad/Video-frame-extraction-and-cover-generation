import type { CoverResult } from '../types/cover';

export async function saveCover(item: CoverResult) {
  const res = await fetch(item.url);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `douyin-cover-${item.ratio.replace(':', 'x')}-${Date.now()}.jpg`;
  link.click();
  URL.revokeObjectURL(url);
}
