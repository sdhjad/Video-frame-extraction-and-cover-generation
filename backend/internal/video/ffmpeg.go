package video

import (
	"fmt"
	"path/filepath"

	ffmpeg "github.com/u2takey/ffmpeg-go"
)

type Extractor struct{}

// NewExtractor keeps ffmpeg construction explicit for the runner.
func NewExtractor() Extractor {
	return Extractor{}
}

// Extract runs ffmpeg and writes files like frame_000001.jpg into framesDir.
func (Extractor) Extract(input, framesDir string, opts ExtractOptions) error {
	format := opts.Format
	if format == "" {
		format = "jpg"
	}
	pattern := filepath.Join(framesDir, "frame_%06d."+format)
	args := ffmpeg.KwArgs{}
	if opts.FPS > 0 {
		// ffmpeg's fps filter samples the source video at the requested frames per second.
		args["vf"] = fmt.Sprintf("fps=%g", opts.FPS)
	}
	return ffmpeg.Input(input).Output(pattern, args).OverWriteOutput().Run()
}
