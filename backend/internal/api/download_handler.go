package api

import (
	"net/http"
	"path/filepath"

	"video-frame-tool/backend/internal/storage"

	"github.com/gin-gonic/gin"
)

type downloadRequest struct {
	Frames []string `json:"frames"`
}

func (s Server) downloadFrames(c *gin.Context) {
	job, ok := s.jobs.Snapshot(c.Param("id"))
	if !ok {
		fail(c, http.StatusNotFound, "job not found")
		return
	}
	var req downloadRequest
	if err := c.BindJSON(&req); err != nil || len(req.Frames) == 0 {
		fail(c, http.StatusBadRequest, "no frames selected")
		return
	}
	zipPath := filepath.Join(s.store.JobDir(job.ID), "selected.zip")
	if err := storage.ZipFrames(job.FramesDir, zipPath, cleanNames(req.Frames)); err != nil {
		fail(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.FileAttachment(zipPath, "selected-frames.zip")
}

// cleanNames prevents path traversal by turning every requested frame into a plain file name.
func cleanNames(names []string) []string {
	out := make([]string, 0, len(names))
	for _, name := range names {
		out = append(out, filepath.Base(name))
	}
	return out
}
