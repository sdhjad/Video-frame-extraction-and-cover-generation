package covers

// Prompt combines a stable cover brief with the user's custom description.
func Prompt(extra string) string {
	base := "基于参考帧生成一张适合抖音使用的高质量封面。" +
		"严格遵守用户要求规范。简约商务干净风，主体清晰明亮，" +
		"大字醒目简洁，无任何导流信息，画面清爽高级，合规无违规元素，" +
		"画面不要翻转，确保画面平整，不要添加水印。"
	if extra == "" {
		return base
	}
	return base + " 额外要求：" + extra
}
