package covers

import (
	"errors"

	"video-frame-tool/backend/internal/apimart"
)

type Service struct {
	client apimart.Client
	ready  bool
}

// Request contains the selected video frame and the user's cover-generation choices.
type Request struct {
	FramePath string
	Prompt    string
	Ratios    []string
	ExtraRef  string
}

// New returns a disabled service when the API key is missing so extraction still works.
func New(key string) (Service, error) {
	if key == "" {
		return Service{}, errors.New("missing APIMART_API_KEY")
	}
	return Service{client: apimart.New(key), ready: true}, nil
}

// Generate submits one APIMart image task per requested ratio and waits for usable URLs.
func (s Service) Generate(req Request) ([]apimart.ImageJob, error) {
	if !s.ready {
		return nil, errors.New("cover generation is not configured")
	}
	mainRef, err := DataURL(req.FramePath)
	if err != nil {
		return nil, err
	}
	imageURLs := appendRefs(mainRef, req.ExtraRef)
	jobs := makeJobs(req.Ratios)
	for i := range jobs {
		// The current frame is always the first reference; the optional cover image is second.
		id, err := s.client.SubmitCover(Prompt(req.Prompt), jobs[i].Ratio, imageURLs)
		if err != nil {
			return nil, err
		}
		jobs[i].TaskID = id
		jobs[i] = s.wait(jobs[i])
	}
	return completed(jobs), nil
}

// appendRefs preserves the reference-image order expected by the image model.
func appendRefs(mainRef, extra string) []string {
	if extra == "" {
		return []string{mainRef}
	}
	return []string{mainRef, extra}
}

// completed hides failed or still-pending tasks from the frontend gallery.
func completed(jobs []apimart.ImageJob) []apimart.ImageJob {
	out := []apimart.ImageJob{}
	for _, job := range jobs {
		if job.URL != "" {
			out = append(out, job)
		}
	}
	return out
}
