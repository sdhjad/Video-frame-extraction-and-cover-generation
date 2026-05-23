import type { Frame } from '../types/frame';
import { FrameCard } from './FrameCard';

type Props = {
  frames: Frame[];
  selected: Set<string>;
  onPreview: (frame: Frame) => void;
  onToggle: (frame: Frame, index: number, range: boolean) => void;
};

export function FrameGrid({ frames, selected, onPreview, onToggle }: Props) {
  if (!frames.length) return <section className="empty">暂无帧预览</section>;
  return (
    <section className="grid">
      {frames.map((frame, index) => (
        <FrameCard key={frame.name} frame={frame} selected={selected.has(frame.name)}
          onPreview={() => onPreview(frame)}
          onToggle={(event) => onToggle(frame, index, event.shiftKey)} />
      ))}
    </section>
  );
}
