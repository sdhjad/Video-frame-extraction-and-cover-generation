package jobs

// run moves a queued job through processing, done, or failed states.
func (m *Manager) run(id string) {
	job, ok := m.Get(id)
	if !ok {
		return
	}
	m.setStatus(job, StatusProcessing, 10, "")
	if err := m.runner.Run(job); err != nil {
		m.setStatus(job, StatusFailed, job.Progress, err.Error())
		return
	}
	m.setStatus(job, StatusDone, 100, "")
}

// setStatus centralizes status mutation behind the manager lock.
func (m *Manager) setStatus(job *Job, status Status, progress int, msg string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	job.Status = status
	job.Progress = progress
	job.Error = msg
}

// SetFrameCount records the extracted frame count once ffmpeg has completed.
func (m *Manager) SetFrameCount(job *Job, count int) {
	m.mu.Lock()
	defer m.mu.Unlock()
	job.FrameCount = count
	job.Progress = 95
}
