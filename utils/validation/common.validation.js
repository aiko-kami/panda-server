const validateColors = (colors) => {
	const { colorBase, bgColor, bgColorHover } = colors || {};

	//String type validation
	if (typeof colorBase !== "string" || typeof bgColor !== "string" || typeof bgColorHover !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!colorBase.trim()) {
		return { status: "error", message: "Color base is required." };
	}
	if (!bgColor.trim()) {
		return { status: "error", message: "Background color is required." };
	}
	if (!bgColorHover.trim()) {
		return { status: "error", message: "Background color hover is required." };
	}
	// If all validations passed
	return { status: "success", message: "All color inputs are valid." };
};

module.exports = {
	validateColors,
};
