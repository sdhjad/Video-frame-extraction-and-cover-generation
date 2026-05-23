type Props = {
  count: number;
  total: number;
  onAll: () => void;
  onClearPage: () => void;
  onClearSelection: () => void;
  onInvert: () => void;
  onDownload: () => void;
};

export function FrameToolbar(props: Props) {
  return (
    <section className="toolbar">
      <span className="selection">已选 {props.count} / {props.total}</span>
      <button onClick={props.onAll}>全选</button>
      <button onClick={props.onClearSelection}>取消选择</button>
      <button onClick={props.onInvert}>反选</button>
      <button onClick={props.onClearPage} disabled={!props.total}>清空页面</button>
      <button className="primary" disabled={!props.count} onClick={props.onDownload}>
        下载选中
      </button>
      <small>Ctrl+A 全选 · Shift 连选 · Backspace 清空页面 · I 反选 · D 下载</small>
    </section>
  );
}
