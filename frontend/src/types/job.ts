export type JobStatus = 'queued' | 'processing' | 'done' | 'failed';

export type Job = {
  id: string;
  status: JobStatus;
  progress: number;
  frameCount: number;
  error?: string;
};
