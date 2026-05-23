package jobs

// SetRunner allows main to construct the manager before the video runner exists.
func (m *Manager) SetRunner(runner Runner) {
	m.runner = runner
}
