package api

import (
	"video-frame-tool/backend/internal/covers"
	"video-frame-tool/backend/internal/jobs"
	"video-frame-tool/backend/internal/storage"

	"github.com/gin-gonic/gin"
)

type Server struct {
	jobs   *jobs.Manager
	store  storage.Store
	covers covers.Service
}

// NewServer wires route handlers to the shared job manager, storage paths, and AI cover service.
func NewServer(manager *jobs.Manager, store storage.Store, coverSvc covers.Service) Server {
	return Server{jobs: manager, store: store, covers: coverSvc}
}

// Router exposes the API used by the Vite frontend.
func (s Server) Router() *gin.Engine {
	r := gin.Default()
	r.Use(cors())
	api := r.Group("/api")
	api.POST("/jobs", s.createJob)
	api.GET("/jobs/:id", s.getJob)
	api.GET("/jobs/:id/frames", s.listFrames)
	api.GET("/jobs/:id/frames/:name", s.getFrame)
	api.POST("/jobs/:id/download", s.downloadFrames)
	api.POST("/jobs/:id/covers", s.generateCovers)
	return r
}
