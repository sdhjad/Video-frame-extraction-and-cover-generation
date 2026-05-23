import { API_BASE } from './http';

export async function downloadFrames(jobId: string, names: string[]) {
  const res = await fetch(`${API_BASE}/api/jobs/${jobId}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frames: names }),
  });
  if (!res.ok) throw new Error('download failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  triggerDownload(url, 'selected-frames.zip');
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
