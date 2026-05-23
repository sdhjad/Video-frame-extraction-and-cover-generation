package apimart

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type taskResp struct {
	Data struct {
		Status string `json:"status"`
		Result struct {
			Images []struct {
				URL []string `json:"url"`
			} `json:"images"`
		} `json:"result"`
	} `json:"data"`
}

// TaskURL reads the current state of an APIMart task and extracts the first image URL.
func (c Client) TaskURL(id string) (string, string, error) {
	req, _ := http.NewRequest("GET", "https://api.apimart.ai/v1/tasks/"+id, nil)
	req.Header.Set("Authorization", "Bearer "+c.key)
	res, err := c.http.Do(req)
	if err != nil {
		return "", "", err
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		return "", "", fmt.Errorf("task status %d", res.StatusCode)
	}
	var out taskResp
	if err := json.NewDecoder(res.Body).Decode(&out); err != nil {
		return "", "", err
	}
	return out.Data.Status, firstURL(out), nil
}

// firstURL handles APIMart responses that are valid but do not contain an image yet.
func firstURL(out taskResp) string {
	if len(out.Data.Result.Images) == 0 || len(out.Data.Result.Images[0].URL) == 0 {
		return ""
	}
	return out.Data.Result.Images[0].URL[0]
}
