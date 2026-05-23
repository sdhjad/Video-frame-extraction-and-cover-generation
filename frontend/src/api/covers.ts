import { request } from './http';
import type { CoverResult } from '../types/cover';

export type CoverInput = {
  extraRef: string;
  frame: string;
  prompt: string;
  ratios: string[];
};

export function generateCovers(jobId: string, input: CoverInput) {
  return request<CoverResult[]>(`/api/jobs/${jobId}/covers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}
