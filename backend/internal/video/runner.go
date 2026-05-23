package video

import (
	"video-frame-tool/backend/internal/jobs"
	"video-frame-tool/backend/internal/storage"
)

type Runner struct {
	Extractor Extractor
	Manager   *jobs.Manager
}

// Run extracts frames and reports the final count back to the job manager.
func (r Runner) Run(job *jobs.Job) error {
	opts := ExtractOptions{FPS: job.Options.FPS, Format: job.Options.Format}
	if err := r.Extractor.Extract(job.SourcePath, job.FramesDir, opts); err != nil {
		return err
	}
	frames, err := storage.ListFrames(job.FramesDir, "")
	if err != nil {
		return err
	}
	r.Manager.SetFrameCount(job, len(frames))
	return nil
}
