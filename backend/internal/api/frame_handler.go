package api

import (
	"net/http"
	"path/filepath"

	"video-frame-tool/backend/internal/storage"

	"github.com/gin-gonic/gin"
)

func (s Server) listFrames(c *gin.Context) {
	job, ok := s.jobs.Snapshot(c.Param("id"))
	if !ok {
		fail(c, http.StatusNotFound, "job not found")
		return
	}
	base := "/api/jobs/" + job.ID + "/frames"
	frames, err := storage.ListFrames(job.FramesDir, base)
	if err != nil {
		fail(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, frames)
}

func (s Server) getFrame(c *gin.Context) {
	job, ok := s.jobs.Snapshot(c.Param("id"))
	if !ok {
		fail(c, http.StatusNotFound, "job not found")
		return
	}
	// filepath.Base keeps the file read scoped to the extracted frames directory.
	c.File(filepath.Join(job.FramesDir, filepath.Base(c.Param("name"))))
}
