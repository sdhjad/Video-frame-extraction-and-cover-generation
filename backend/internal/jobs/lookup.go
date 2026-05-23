package jobs

// Get returns the live job pointer for internal updates.
func (m *Manager) Get(id string) (*Job, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	job, ok := m.jobs[id]
	return job, ok
}

// Snapshot returns a value copy so HTTP handlers do not expose mutable job state.
func (m *Manager) Snapshot(id string) (*Job, bool) {
	job, ok := m.Get(id)
	if !ok {
		return nil, false
	}
	copy := *job
	return &copy, true
}
