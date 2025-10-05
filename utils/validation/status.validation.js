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

const validateStatusId = (statusId) => {
	//String type validation
	if (!statusId) {
		return { status: "error", message: "Status ID is required." };
	}
	if (typeof statusId !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	// If all validations passed
	return { status: "success" };
};

const validateStatusName = (statusName) => {
	//String type validation
	if (!statusName) {
		return { status: "error", message: "Status name is required." };
	}
	if (typeof statusName !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	// If all validations passed
	return { status: "success" };
};

const validateStatusNameAndDescription = (statusName, statusDescription) => {
	//String type validation
	if (!statusName) {
		return { status: "error", message: "Status name is required." };
	}
	if (typeof statusName !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!statusDescription) {
		return { status: "error", message: "Status description is required." };
	}
	if (typeof statusDescription !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	// If all validations passed
	return { status: "success" };
};

module.exports = {
	validateStatusInputs,
	validateStatusId,
	validateStatusName,
	validateStatusNameAndDescription,
};
