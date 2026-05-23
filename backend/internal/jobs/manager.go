package jobs

import "sync"

type Manager struct {
	mu     sync.RWMutex
	jobs   map[string]*Job
	queue  chan string
	runner Runner
}

// Runner is implemented by the video package to keep job orchestration separate from ffmpeg.
type Runner interface {
	Run(job *Job) error
}

// NewManager owns all in-memory jobs for this personal-use server.
func NewManager(runner Runner) *Manager {
	return &Manager{
		jobs:   map[string]*Job{},
		queue:  make(chan string, 4),
		runner: runner,
	}
}

// Start launches the single background worker that processes extraction jobs in order.
func (m *Manager) Start() {
	go func() {
		for id := range m.queue {
			m.run(id)
		}
	}()
}
