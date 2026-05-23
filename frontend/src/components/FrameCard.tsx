import { frameSrc } from '../api/frames';
import type { Frame } from '../types/frame';

type Props = {
  frame: Frame;
  selected: boolean;
  onPreview: () => void;
  onToggle: (event: React.MouseEvent) => void;
};

export function FrameCard({ frame, selected, onPreview, onToggle }: Props) {
  return (
    <article className={`frame ${selected ? 'selected' : ''}`}>
      <button className="frameImage" onClick={onPreview} aria-label="放大预览">
        <img src={frameSrc(frame)} loading="lazy" />
      </button>
      <div className="frameActions">
        <button className="frameMeta" onClick={onToggle}>
          <strong>#{String(frame.index).padStart(4, '0')}</strong>
          <span>{frame.name}</span>
        </button>
      </div>
    </article>
  );
}
