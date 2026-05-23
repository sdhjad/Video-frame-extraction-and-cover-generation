import { useEffect, useState } from 'react';
import { getJob } from '../api/jobs';
import type { Job } from '../types/job';

export function useJobPolling(initial: Job | null) {
  const [job, setJob] = useState<Job | null>(initial);

  useEffect(() => {
    setJob(initial);
  }, [initial]);

  useEffect(() => {
    if (!job || job.status === 'done' || job.status === 'failed') return;
    const timer = window.setInterval(async () => {
      setJob(await getJob(job.id));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [job]);

  return job;
}
