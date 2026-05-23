import { useEffect, useState } from 'react';
import { frameSrc } from '../api/frames';
import type { CoverResult } from '../types/cover';
import type { Frame } from '../types/frame';
import { saveCover } from '../utils/saveCover';
import { RefUpload } from './RefUpload';

export type GenerateInput = { prompt: string; ratios: string[]; extraRef: string };

type Props = {
  busy: boolean; error: string; frame: Frame | null; index: number;
  results: CoverResult[]; total: number; onClose: () => void;
  onGenerate: (input: GenerateInput) => void; onNext: () => void; onPrev: () => void;
};

export function FramePreview(props: Props) {
  const [prompt, setPrompt] = useState('');
  const [ratios, setRatios] = useState<string[]>(['3:4']);
  const [extraRef, setExtraRef] = useState('');
  const [activeCover, setActiveCover] = useState<CoverResult | null>(null);
  usePreviewKeys(props.frame, props.onClose, props.onNext, props.onPrev);
  useEffect(() => setActiveCover(null), [props.frame?.name]);
  if (!props.frame) return null;
  return <section className="preview" onClick={props.onClose}>
    <div className="previewShell" onClick={(event) => event.stopPropagation()}>
      <CoverHistory results={props.results} active={activeCover} onPick={setActiveCover} />
      <PreviewImage {...props} activeCover={activeCover} />
      <AIPanel busy={props.busy} error={props.error} prompt={prompt} ratios={ratios}
        setPrompt={setPrompt} setRatios={setRatios} setExtraRef={setExtraRef}
        onGenerate={() => props.onGenerate({ prompt, ratios, extraRef })} />
    </div>
  </section>;
}

function CoverHistory(props: { results: CoverResult[]; active: CoverResult | null; onPick: (v: CoverResult) => void }) {
  const results = props.results.filter((item) => item.url);
  return <aside className="coverHistory"><h2>生成历史</h2>{results.length === 0 && <p>暂无封面</p>}
    {results.map((item, i) => <div className="coverItem" key={`${item.ratio}-${i}`}>
      <button className={props.active?.url === item.url ? 'active' : ''} onClick={() => props.onPick(item)}>
        <img src={item.url} /><span>{item.label} · {item.ratio}</span></button>
      <button className="saveCover" onClick={() => saveCover(item)}>保存到本地</button>
    </div>)}</aside>;
}

function PreviewImage(props: Props & { activeCover: CoverResult | null }) {
  const src = props.activeCover?.url || frameSrc(props.frame!);
  const name = props.activeCover ? `${props.activeCover.label} · ${props.activeCover.ratio}` : props.frame!.name;
  return <div className="previewPanel">
    <button className="previewClose" aria-label="关闭" onClick={props.onClose}>×</button>
    <button className="previewNav left" aria-label="上一张" onClick={props.onPrev}>‹</button>
    <button className="previewNav right" aria-label="下一张" onClick={props.onNext}>›</button>
    <img src={src} alt={name} /><p>{name}<span>{props.index + 1} / {props.total}</span></p></div>;
}

type PanelProps = {
  busy: boolean; error: string; prompt: string; ratios: string[];
  setExtraRef: (v: string) => void; setPrompt: (v: string) => void;
  setRatios: (v: string[]) => void; onGenerate: () => void;
};

function AIPanel(props: PanelProps) {
  return <aside className="aiPanel"><h2>AI 封面生成</h2>
    <p>选择比例，可上传一张封面参考图，再描述你想要的风格。</p>
    <RatioPicker ratios={props.ratios} setRatios={props.setRatios} />
    <RefUpload onChange={props.setExtraRef} />
    <textarea value={props.prompt} onChange={(e) => props.setPrompt(e.target.value)}
      placeholder="例如：突出人物表情，增强冲突感，标题感强，适合美食探店封面" />
    <button className="primary" disabled={props.busy || !props.ratios.length} onClick={props.onGenerate}>
      {props.busy ? '生成中...' : '生成封面'}
    </button>
    {props.error && <p className="error">{props.error}</p>}
  </aside>;
}

function RatioPicker({ ratios, setRatios }: { ratios: string[]; setRatios: (v: string[]) => void }) {
  const toggle = (r: string) => setRatios(ratios.includes(r) ? ratios.filter((x) => x !== r) : [...ratios, r]);
  return <div className="ratioPicker"><button className={ratios.includes('3:4') ? 'active' : ''}
    onClick={() => toggle('3:4')}>竖屏 3:4</button><button className={ratios.includes('4:3') ? 'active' : ''}
    onClick={() => toggle('4:3')}>横屏 4:3</button></div>;
}

function usePreviewKeys(frame: Frame | null, close: () => void, next: () => void, prev: () => void) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (event.key === 'ArrowLeft') prev();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'Escape') close();
    };
    if (frame) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [frame, close, next, prev]);
}
