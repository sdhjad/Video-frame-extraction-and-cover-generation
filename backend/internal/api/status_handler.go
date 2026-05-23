package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s Server) getJob(c *gin.Context) {
	job, ok := s.jobs.Snapshot(c.Param("id"))
	if !ok {
		fail(c, http.StatusNotFound, "job not found")
		return
	}
	c.JSON(http.StatusOK, job)
}
