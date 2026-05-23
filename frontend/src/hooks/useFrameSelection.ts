import { useMemo, useState } from 'react';
import type { Frame } from '../types/frame';

export function useFrameSelection(frames: Frame[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [anchor, setAnchor] = useState<number | null>(null);

  const names = useMemo(() => frames.map((f) => f.name), [frames]);
  const toggle = (name: string, index: number, range: boolean) => {
    setSelected((prev) => range && anchor !== null
      ? selectRange(prev, names, anchor, index)
      : toggleOne(prev, name));
    setAnchor(index);
  };

  return {
    selected,
    selectedNames: [...selected],
    toggle,
    clear: () => setSelected(new Set()),
    all: () => setSelected(new Set(names)),
    invert: () => setSelected(new Set(names.filter((n) => !selected.has(n)))),
  };
}

function toggleOne(prev: Set<string>, name: string) {
  const next = new Set(prev);
  next.has(name) ? next.delete(name) : next.add(name);
  return next;
}

function selectRange(prev: Set<string>, names: string[], a: number, b: number) {
  const next = new Set(prev);
  names.slice(Math.min(a, b), Math.max(a, b) + 1).forEach((n) => next.add(n));
  return next;
}
