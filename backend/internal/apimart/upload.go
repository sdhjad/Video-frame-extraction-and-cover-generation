package apimart

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

type uploadResp struct {
	Data struct {
		URL string `json:"url"`
	} `json:"data"`
}

// UploadImage is kept for future multipart upload support; current cover flow uses base64.
func (c Client) UploadImage(path string) (string, error) {
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	if err := addFormFile(writer, path); err != nil {
		return "", err
	}
	writer.Close()
	req, _ := http.NewRequest("POST", "https://api.apimart.ai/v1/uploads/images", &body)
	req.Header.Set("Authorization", "Bearer "+c.key)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	res, err := c.http.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		return "", fmt.Errorf("upload status %d", res.StatusCode)
	}
	var out uploadResp
	if err := json.NewDecoder(res.Body).Decode(&out); err != nil {
		return "", err
	}
	return out.Data.URL, nil
}

// addFormFile streams a local image into a multipart request body.
func addFormFile(writer *multipart.Writer, path string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()
	part, err := writer.CreateFormFile("file", filepath.Base(path))
	if err != nil {
		return err
	}
	_, err = io.Copy(part, file)
	return err
}
