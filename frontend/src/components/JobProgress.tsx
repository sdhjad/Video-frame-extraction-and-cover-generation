import type { Job } from '../types/job';

type Props = {
  job: Job | null;
  uploading: boolean;
};

export function JobProgress({ job, uploading }: Props) {
  if (uploading) return (
    <section className="panel progress">
      <div><strong>上传中</strong><span>正在提交视频文件</span></div>
      <progress className="indeterminate" />
    </section>
  );
  if (!job) return <section className="panel progress muted">等待导入视频</section>;
  return (
    <section className="panel progress">
      <div>
        <strong>{label(job.status)}</strong>
        <span>{job.frameCount ? `${job.frameCount} 帧` : '等待帧输出'}</span>
      </div>
      <progress max="100" value={job.progress} />
      {job.error && <p className="error">{job.error}</p>}
    </section>
  );
}

function label(status: Job['status']) {
  return { queued: '排队中', processing: '处理中', done: '已完成', failed: '失败' }[status];
}
