package main

import (
	"log"

	"video-frame-tool/backend/internal/api"
	"video-frame-tool/backend/internal/config"
	"video-frame-tool/backend/internal/covers"
	"video-frame-tool/backend/internal/jobs"
	"video-frame-tool/backend/internal/storage"
	"video-frame-tool/backend/internal/video"
)

func main() {
	cfg := config.Load()
	store := storage.New(cfg.StorageDir)
	manager := jobs.NewManager(nil)
	runner := video.Runner{Extractor: video.NewExtractor(), Manager: manager}
	manager.SetRunner(runner)
	manager.Start()
	coverSvc, err := covers.New(cfg.APIMartKey)
	if err != nil {
		log.Println("cover generation disabled:", err)
	}

	server := api.NewServer(manager, store, coverSvc)
	log.Fatal(server.Router().Run(":" + cfg.Port))
}
