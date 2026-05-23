package storage

import (
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
)

// PrepareJob creates the directory tree needed for one upload.
func (s Store) PrepareJob(id string) error {
	if err := os.MkdirAll(s.FramesDir(id), 0755); err != nil {
		return err
	}
	return nil
}

// SaveUploaded streams the multipart upload to disk without buffering it all in memory.
func SaveUploaded(file multipart.File, dst string) error {
	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}
	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()
	_, err = io.Copy(out, file)
	return err
}
