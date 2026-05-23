import type { CoverResult } from '../types/cover';

type Props = {
  busy: boolean;
  results: CoverResult[];
  error: string;
};

export function CoverPanel({ busy, results, error }: Props) {
  if (!busy && !results.length && !error) return null;
  return (
    <section className="coverPanel">
      <h2>抖音封面</h2>
      {busy && <p>正在生成 3:4 和 4:3 两张封面，可能需要 1-2 分钟。</p>}
      {error && <p className="error">{error}</p>}
      <div className="coverGrid">
        {results.map((item) => (
          <a key={item.ratio} href={item.url} target="_blank">
            <img src={item.url} />
            <span>{item.label} · {item.ratio}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
