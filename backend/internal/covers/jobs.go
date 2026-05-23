package covers

import "video-frame-tool/backend/internal/apimart"

// makeJobs expands the user's ratio choices into independent APIMart tasks.
func makeJobs(ratios []string) []apimart.ImageJob {
	if len(ratios) == 0 {
		ratios = []string{"3:4"}
	}
	jobs := make([]apimart.ImageJob, 0, len(ratios))
	for _, ratio := range ratios {
		jobs = append(jobs, apimart.ImageJob{Label: label(ratio), Ratio: ratio})
	}
	return jobs
}

func label(ratio string) string {
	if ratio == "4:3" {
		return "横屏封面"
	}
	return "竖屏封面"
}
