package api

import (
	"net/http"
	"path/filepath"
	"strconv"

	"video-frame-tool/backend/internal/jobs"
	"video-frame-tool/backend/internal/storage"

	"github.com/gin-gonic/gin"
)

func (s Server) createJob(c *gin.Context) {
	// The frontend uploads the video as multipart/form-data under the "video" field.
	file, header, err := c.Request.FormFile("video")
	if err != nil {
		fail(c, http.StatusBadRequest, "missing video file")
		return
	}
	defer file.Close()
	opts := parseOptions(c.PostForm("fps"), c.PostForm("format"))
	job := s.jobs.Create("", "", opts)

	// Each upload gets an isolated storage directory to keep frames and downloads together.
	if err := s.store.PrepareJob(job.ID); err != nil {
		fail(c, http.StatusInternalServerError, err.Error())
		return
	}
	source := s.store.SourcePath(job.ID, filepath.Ext(header.Filename))
	if err := storage.SaveUploaded(file, source); err != nil {
		fail(c, http.StatusInternalServerError, err.Error())
		return
	}
	s.jobs.SetPaths(job, source, s.store.FramesDir(job.ID))
	s.jobs.Enqueue(job.ID)
	c.JSON(http.StatusAccepted, job)
}

// parseOptions normalizes loose form values before they reach the ffmpeg layer.
func parseOptions(fpsText, format string) jobs.Options {
	fps, _ := strconv.ParseFloat(fpsText, 64)
	if format != "png" {
		format = "jpg"
	}
	return jobs.Options{FPS: fps, Format: format}
}
