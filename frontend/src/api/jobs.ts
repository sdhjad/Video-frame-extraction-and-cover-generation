import { request } from './http';
import type { ExtractOptions } from '../types/options';
import type { Job } from '../types/job';

export async function createJob(file: File, opts: ExtractOptions) {
  const data = new FormData();
  data.append('video', file);
  data.append('fps', String(opts.fps || 0));
  data.append('format', opts.format);
  return request<Job>('/api/jobs', { method: 'POST', body: data });
}

export function getJob(id: string) {
  return request<Job>(`/api/jobs/${id}`);
}
