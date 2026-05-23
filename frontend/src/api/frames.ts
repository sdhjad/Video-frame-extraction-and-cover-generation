import { API_BASE, request } from './http';
import type { Frame } from '../types/frame';

export function getFrames(jobId: string) {
  return request<Frame[]>(`/api/jobs/${jobId}/frames`);
}

export function frameSrc(frame: Frame) {
  return `${API_BASE}${frame.url}`;
}
