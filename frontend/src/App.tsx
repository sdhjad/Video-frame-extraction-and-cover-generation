import { useEffect, useState } from 'react';
import { generateCovers, type CoverInput } from './api/covers';
import { downloadFrames } from './api/download';
import { getFrames } from './api/frames';
import { createJob } from './api/jobs';
import { FrameGrid } from './components/FrameGrid';
import { FramePreview, type GenerateInput } from './components/FramePreview';
import { FrameToolbar } from './components/FrameToolbar';
import { JobProgress } from './components/JobProgress';
import { UploadPanel } from './components/UploadPanel';
import { useFrameSelection } from './hooks/useFrameSelection';
import { useJobPolling } from './hooks/useJobPolling';
import { useKeyboardSelection } from './hooks/useKeyboardSelection';
import type { CoverResult } from './types/cover';
import type { Frame } from './types/frame';
import type { Job } from './types/job';
import type { ExtractOptions } from './types/options';
import videoIcon from './assets/video-icon.png';
import './styles/base.css'; import './styles/app.css'; import './styles/frames.css';
import './styles/preview.css'; import './styles/motion.css'; import './styles/responsive.css';

export default function App() {
  const [initialJob, setInitialJob] = useState<Job | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [covers, setCovers] = useState<CoverResult[]>([]);
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [options, setOptions] = useState<ExtractOptions>({ fps: 1, format: 'jpg' });
  const job = useJobPolling(initialJob);
  const selection = useFrameSelection(frames);

  async function upload(file: File) {
    clearPage(); setUploading(true);
    try { setInitialJob(await createJob(file, options)); } finally { setUploading(false); }
  }

  function clearPage() {
    setInitialJob(null); setFrames([]); setPreviewIndex(null); selection.clear(); setCovers([]);
  }

  async function cover(frame: Frame, input: GenerateInput) {
    if (!job) return;
    setCoverBusy(true); setCoverError('');
    const payload: CoverInput = { frame: frame.name, ...input };
    try {
      const nextCovers = (await generateCovers(job.id, payload)).filter((item) => item.url);
      if (!nextCovers.length) throw new Error('生成结果没有图片地址');
      setCovers((old) => [...nextCovers, ...old]);
    }
    catch (err) { setCoverError(err instanceof Error ? err.message : '生成失败'); }
    finally { setCoverBusy(false); }
  }

  async function download() {
    if (job && selection.selectedNames.length) await downloadFrames(job.id, selection.selectedNames);
  }

  const previewFrame = previewIndex === null ? null : frames[previewIndex] ?? null;
  const next = () => setPreviewIndex((i) => i === null ? i : (i + 1) % frames.length);
  const prev = () => setPreviewIndex((i) => i === null ? i : (i - 1 + frames.length) % frames.length);
  useKeyboardSelection({ ...selection, clear: clearPage, download, disabled: previewIndex !== null });
  useEffect(() => { if (job?.status === 'done') getFrames(job.id).then(setFrames); }, [job]);

  return <main><header className="hero"><img className="appIcon" src={videoIcon} alt="" />
    <h1>视频提取帧</h1><p>视频转图片、视频截图、视频逐帧提取，轻松提取画面并转换为 JPG 或 PNG。</p></header>
    <section className="uploadCard"><UploadPanel busy={uploading || job?.status === 'processing'}
      options={options} onOptions={setOptions} onSubmit={upload} />
      <JobProgress job={job} uploading={uploading} /></section>
    <FrameToolbar count={selection.selected.size} total={frames.length}
      onAll={selection.all} onClearPage={clearPage} onClearSelection={selection.clear}
      onInvert={selection.invert} onDownload={download} />
    <FrameGrid frames={frames} selected={selection.selected}
      onPreview={(frame) => { setCoverError(''); setPreviewIndex(frames.indexOf(frame)); }}
      onToggle={(f, i, r) => selection.toggle(f.name, i, r)} />
    <FramePreview frame={previewFrame} index={previewIndex ?? 0} total={frames.length}
      busy={coverBusy} error={coverError} results={covers}
      onGenerate={(input) => previewFrame && cover(previewFrame, input)}
      onClose={() => setPreviewIndex(null)} onNext={next} onPrev={prev} />
  </main>;
}
