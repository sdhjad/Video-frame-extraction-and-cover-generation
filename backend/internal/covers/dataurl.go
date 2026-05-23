package covers

import (
	"encoding/base64"
	"mime"
	"os"
	"path/filepath"
)

// DataURL converts an extracted frame into a base64 data URL for APIMart image input.
func DataURL(path string) (string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	mimeType := mime.TypeByExtension(filepath.Ext(path))
	if mimeType == "" {
		mimeType = "image/jpeg"
	}
	return "data:" + mimeType + ";base64," + base64.StdEncoding.EncodeToString(data), nil
}
