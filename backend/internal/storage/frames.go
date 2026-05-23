package storage

import (
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type Frame struct {
	Name  string `json:"name"`
	Index int    `json:"index"`
	URL   string `json:"url"`
}

// ListFrames returns sorted image frames and builds URLs that the frontend can display.
func ListFrames(dir, baseURL string) ([]Frame, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	names := []string{}
	for _, entry := range entries {
		if !entry.IsDir() && isImage(entry.Name()) {
			names = append(names, entry.Name())
		}
	}
	sort.Strings(names)
	frames := make([]Frame, 0, len(names))
	for i, name := range names {
		frames = append(frames, Frame{name, i + 1, baseURL + "/" + name})
	}
	return frames, nil
}

// isImage filters out temporary files and zip files in the frame directory.
func isImage(name string) bool {
	ext := strings.ToLower(filepath.Ext(name))
	return ext == ".jpg" || ext == ".jpeg" || ext == ".png"
}
