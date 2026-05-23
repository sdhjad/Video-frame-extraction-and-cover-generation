package jobs

import (
	"time"

	"github.com/google/uuid"
)

// Create registers a queued extraction job before the uploaded file is written.
func (m *Manager) Create(source, frames string, opts Options) *Job {
	job := &Job{
		ID:         uuid.NewString(),
		Status:     StatusQueued,
		Progress:   0,
		CreatedAt:  time.Now(),
		Options:    opts,
		SourcePath: source,
		FramesDir:  frames,
	}

	m.mu.Lock()
	m.jobs[job.ID] = job
	m.mu.Unlock()
	return job
}

// Enqueue sends a job id to the background worker.
func (m *Manager) Enqueue(id string) {
	m.queue <- id
}
