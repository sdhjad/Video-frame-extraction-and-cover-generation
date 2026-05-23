package apimart

// ImageJob is the cover-generation record returned to the frontend history panel.
type ImageJob struct {
	Label  string `json:"label"`
	Ratio  string `json:"ratio"`
	TaskID string `json:"taskId"`
	URL    string `json:"url"`
	Status string `json:"status"`
	Error  string `json:"error,omitempty"`
}

// GenerateRequest matches APIMart's image generation request body.
type GenerateRequest struct {
	Model      string   `json:"model"`
	Prompt     string   `json:"prompt"`
	Size       string   `json:"size"`
	Resolution string   `json:"resolution"`
	ImageURLs  []string `json:"image_urls"`
	N          int      `json:"n"`
}
