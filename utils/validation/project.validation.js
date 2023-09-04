const validator = require("validator");

const validateNewProjectInputs = (projectData) => {
	//String type validation
	const invalidType =
		typeof projectData.title !== "string" ||
		typeof projectData.goal !== "string" ||
		typeof projectData.summary !== "string" ||
		typeof projectData.description !== "string" ||
		typeof projectData.categoryId !== "string" ||
		typeof projectData.subCategory !== "string" ||
		!Array.isArray(projectData.tagsIds) ||
		typeof projectData.location.city !== "string" ||
		typeof projectData.location.country !== "string" ||
		!Array.isArray(projectData.talentsNeeded) ||
		typeof projectData.startDate !== "number" ||
		typeof projectData.objectives !== "string" ||
		typeof projectData.creatorMotivation !== "string" ||
		typeof projectData.visibility !== "string" ||
		typeof projectData.attachments !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!projectData.title) {
		return { status: "error", message: "Title is required." };
	}
	if (!projectData.goal) {
		return { status: "error", message: "Goal is required." };
	}
	if (!projectData.summary) {
		return { status: "error", message: "Summary is required." };
	}
	if (!projectData.description) {
		return { status: "error", message: "Description is required." };
	}
	if (!projectData.categoryId) {
		return { status: "error", message: "Category is required." };
	}
	if (projectData.talentsNeeded.length == 0) {
		return { status: "error", message: "Talents needed are required." };
	}
	// Validate specific field constraints
	if (!validator.isLength(projectData.title, { min: 4, max: 100 })) {
		return { status: "error", message: "Title must be 4-100 characters." };
	}
	if (!validator.isLength(projectData.goal, { min: 10, max: 500 })) {
		return { status: "error", message: "Goal must be 10-500 characters." };
	}
	if (!validator.isLength(projectData.summary, { min: 10, max: 300 })) {
		return { status: "error", message: "Summary must be 10-300 characters." };
	}
	if (!validator.isLength(projectData.description, { min: 20, max: 10000 })) {
		return { status: "error", message: "Description must be 20-2000 characters." };
	}
	// If all validations passed
	return { status: "success", message: "All project inputs are valid." };
};

module.exports = {
	validateNewProjectInputs,
};
