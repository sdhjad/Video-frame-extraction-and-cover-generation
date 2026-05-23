package config

import (
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

// LoadEnv reads local .env files; missing files are fine for frame extraction.
func LoadEnv() {
	_ = godotenv.Load(envPaths()...)
}

func envPaths() []string {
	paths := []string{".env", filepath.Join("backend", ".env")}
	if exe, err := os.Executable(); err == nil {
		paths = append(paths, filepath.Join(filepath.Dir(exe), ".env"))
	}
	if cwd, err := os.Getwd(); err == nil {
		paths = append(paths, filepath.Join(cwd, ".env"))
	}
	return append(paths, filepath.Join("D:"+string(os.PathSeparator), "视频抽帧", "backend", ".env"))
}
