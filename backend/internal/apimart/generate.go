package apimart

type submitResp struct {
	Data []struct {
		TaskID string `json:"task_id"`
		Status string `json:"status"`
	} `json:"data"`
}

// SubmitCover starts an asynchronous image-generation task and returns its task id.
func (c Client) SubmitCover(prompt, ratio string, imageURLs []string) (string, error) {
	req := GenerateRequest{
		Model: "gpt-image-2", Prompt: prompt, Size: ratio,
		Resolution: "1k", ImageURLs: imageURLs, N: 1,
	}
	var out submitResp
	if err := c.postJSON("/v1/images/generations", req, &out); err != nil {
		return "", err
	}
	if len(out.Data) == 0 {
		return "", nil
	}
	return out.Data[0].TaskID, nil
}
