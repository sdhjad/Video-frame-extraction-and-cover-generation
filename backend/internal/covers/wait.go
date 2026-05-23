package covers

import (
	"log"
	"time"

	"video-frame-tool/backend/internal/apimart"
)

// wait polls APIMart until the async image task returns a URL, fails, or times out.
func (s Service) wait(job apimart.ImageJob) apimart.ImageJob {
	for i := 0; i < 40; i++ {
		status, url, err := s.client.TaskURL(job.TaskID)
		if err != nil {
			job.Error = err.Error()
			return job
		}
		job.Status, job.URL = status, url
		log.Printf("cover task %s ratio=%s status=%s has_url=%t", job.TaskID, job.Ratio, status, url != "")
		if url != "" || status == "failed" {
			return job
		}
		time.Sleep(3 * time.Second)
	}
	return job
}
