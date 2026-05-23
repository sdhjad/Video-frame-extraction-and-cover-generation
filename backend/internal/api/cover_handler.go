package api

import (
	"net/http"
	"path/filepath"

	"video-frame-tool/backend/internal/covers"

	"github.com/gin-gonic/gin"
)

type coverRequest struct {
	ExtraRef string   `json:"extraRef"`
	Frame    string   `json:"frame"`
	Prompt   string   `json:"prompt"`
	Ratios   []string `json:"ratios"`
}

func (s Server) generateCovers(c *gin.Context) {
	job, ok := s.jobs.Snapshot(c.Param("id"))
	if !ok {
		fail(c, http.StatusNotFound, "job not found")
		return
	}
	var req coverRequest
	if err := c.BindJSON(&req); err != nil || req.Frame == "" {
		fail(c, http.StatusBadRequest, "missing frame")
		return
	}
	// Only use the base name from the request so callers cannot read outside the frames folder.
	path := filepath.Join(job.FramesDir, filepath.Base(req.Frame))
	result, err := s.covers.Generate(covers.Request{
		FramePath: path, Prompt: req.Prompt, Ratios: req.Ratios, ExtraRef: req.ExtraRef,
	})
	if err != nil {
		fail(c, http.StatusInternalServerError, err.Error())
		return
	}
	if len(result) == 0 {
		fail(c, http.StatusGatewayTimeout, "cover generation returned no image")
		return
	}
	c.JSON(http.StatusOK, result)
}
