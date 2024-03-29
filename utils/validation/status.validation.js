const validator = require("validator");
const config = require("../../config");
const projectStatus = config.project_status;

const validateStatusInputs = (userIdUpdater, projectId, newStatus, reason) => {
	//Types validation
	const invalidType = typeof userIdUpdater !== "string" || typeof projectId !== "string" || typeof newStatus !== "string" || typeof reason !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Check if required fields are present
	if (!userIdUpdater) {
		return { status: "error", message: "Updater user ID is required." };
	}
	if (!projectId) {
		return { status: "error", message: "Project ID is required." };
	}
	if (!newStatus) {
		return { status: "error", message: "New status is required." };
	}
	if (!reason) {
		return { status: "error", message: "Reason is required." };
	}
	// Verify status is in the standard list
	if (!validator.isIn(newStatus, projectStatus)) {
		return { status: "error", message: `Invalid project status: ${newStatus.toUpperCase()}` };
	}
	// If all validations passed
	return { status: "success", message: "All project inputs are valid." };
};

module.exports = {
	validateStatusInputs,
};
