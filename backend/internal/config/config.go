package config

import (
	"os"
	"path/filepath"
)

type Config struct {
	Port        string
	StorageDir  string
	MaxUploadMB int64
	APIMartKey  string
}

// Load centralizes defaults for the personal local server.
func Load() Config {
	root := filepath.Clean("../storage")
	return Config{
		Port:        "8080",
		StorageDir:  root,
		MaxUploadMB: 1024,
		APIMartKey:  getenv("APIMART_API_KEY"),
	}
}

// getenv is wrapped so config loading is easy to extend later.
func getenv(key string) string {
	return os.Getenv(key)
}
