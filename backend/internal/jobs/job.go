package jobs

import "time"

// Status is the small lifecycle the frontend polls while ffmpeg is running.
type Status string

const (
	StatusQueued     Status = "queued"
	StatusProcessing Status = "processing"
	StatusDone       Status = "done"
	StatusFailed     Status = "failed"
)

type Options struct {
	FPS    float64
	Format string
}

// Job contains public progress fields plus private local file paths.
type Job struct {
	ID         string    `json:"id"`
	Status     Status    `json:"status"`
	Progress   int       `json:"progress"`
	FrameCount int       `json:"frameCount"`
	Error      string    `json:"error,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
	Options    Options   `json:"options"`
	SourcePath string    `json:"-"`
	FramesDir  string    `json:"-"`
}
