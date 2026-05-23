package storage

import "path/filepath"

type Store struct {
	Root string
}

// New stores all runtime files under one root directory.
func New(root string) Store {
	return Store{Root: root}
}

// JobDir is the per-job workspace containing source video, frames, and downloads.
func (s Store) JobDir(id string) string {
	return filepath.Join(s.Root, "jobs", id)
}

// SourcePath preserves the uploaded extension so ffmpeg can infer the container.
func (s Store) SourcePath(id, ext string) string {
	return filepath.Join(s.JobDir(id), "source"+ext)
}

// FramesDir is where ffmpeg writes extracted images.
func (s Store) FramesDir(id string) string {
	return filepath.Join(s.JobDir(id), "frames")
}
