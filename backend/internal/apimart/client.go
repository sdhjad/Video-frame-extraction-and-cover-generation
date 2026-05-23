package apimart

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	key  string
	http *http.Client
}

// New creates a small APIMart client with a long timeout for image-generation calls.
func New(key string) Client {
	return Client{key: key, http: &http.Client{Timeout: 120 * time.Second}}
}

// postJSON is shared by JSON-based APIMart endpoints.
func (c Client) postJSON(path string, in, out any) error {
	body, _ := json.Marshal(in)
	req, err := http.NewRequest("POST", "https://api.apimart.ai"+path, bytes.NewReader(body))
	if err != nil {
		return err
	}
	// The key is kept server-side; the frontend never receives it.
	req.Header.Set("Authorization", "Bearer "+c.key)
	req.Header.Set("Content-Type", "application/json")
	res, err := c.http.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		return fmt.Errorf("apimart status %d", res.StatusCode)
	}
	return json.NewDecoder(res.Body).Decode(out)
}
