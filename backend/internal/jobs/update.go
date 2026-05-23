package jobs

// SetPaths attaches the saved source video and target frames folder to a job.
func (m *Manager) SetPaths(job *Job, source, frames string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	job.SourcePath = source
	job.FramesDir = frames
}
