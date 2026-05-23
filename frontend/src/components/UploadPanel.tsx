import type { DragEvent } from 'react';
import type { ExtractOptions } from '../types/options';
import uploadIcon from '../assets/upload-icon.png';

type Props = {
  busy: boolean;
  options: ExtractOptions;
  onOptions: (options: ExtractOptions) => void;
  onSubmit: (file: File) => void;
};

export function UploadPanel({ busy, options, onOptions, onSubmit }: Props) {
  function drop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) onSubmit(file);
  }

  return (
    <section className="upload">
      <div className="panelTitle">
        <h2>上传视频</h2>
        <p>选择视频文件以开始提取画面。</p>
      </div>
      <label className="fileDrop" onDragOver={(e) => e.preventDefault()} onDrop={drop}>
        <input type="file" accept="video/*" disabled={busy}
          onChange={(e) => e.target.files?.[0] && onSubmit(e.target.files[0])} />
        <img className="uploadIcon" src={uploadIcon} alt="" />
        <strong>{busy ? '正在处理...' : '选择视频文件'}</strong>
        <em>或将视频拖放到此处</em>
      </label>
      <div className="optionRow">
        <label className="field">
          <span>每秒抽帧</span>
          <input type="number" min="0" step="1" value={options.fps}
            onChange={(e) => onOptions({ ...options, fps: Number(e.target.value) })} />
        </label>
        <label className="field">
          <span>输出格式</span>
          <select value={options.format}
            onChange={(e) => onOptions({ ...options, format: e.target.value as 'jpg' })}>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
          </select>
        </label>
      </div>
    </section>
  );
}
