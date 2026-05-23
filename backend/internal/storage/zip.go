package storage

import (
	"archive/zip"
	"io"
	"os"
	"path/filepath"
)

// ZipFrames packages selected frame files for the frontend download action.
func ZipFrames(framesDir, zipPath string, names []string) error {
	if err := os.MkdirAll(filepath.Dir(zipPath), 0755); err != nil {
		return err
	}
	out, err := os.Create(zipPath)
	if err != nil {
		return err
	}
	defer out.Close()
	zw := zip.NewWriter(out)
	defer zw.Close()
	for _, name := range names {
		if err := addFile(zw, filepath.Join(framesDir, name), name); err != nil {
			return err
		}
	}
	return nil
}

// addFile copies one frame into the open zip writer.
func addFile(zw *zip.Writer, src, name string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()
	w, err := zw.Create(name)
	if err != nil {
		return err
	}
	_, err = io.Copy(w, in)
	return err
}
