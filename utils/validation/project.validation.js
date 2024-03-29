const validator = require("validator");
const config = require("../../config");
const projectVisibility = config.project_visibility;
const projectApprovalList = config.project_approval;

const validateDraftProjectInputs = (projectData) => {
	//Types validation
	const invalidType =
		typeof projectData.title !== "string" ||
		typeof projectData.goal !== "string" ||
		typeof projectData.summary !== "string" ||
		typeof projectData.description !== "string" ||
		typeof projectData.categoryId !== "string" ||
		typeof projectData.subCategory !== "string" ||
		typeof projectData.locationCountry !== "string" ||
		typeof projectData.locationCity !== "string" ||
		(typeof projectData.locationOnlineOnly !== "boolean" && projectData.locationOnlineOnly !== "no value passed") ||
		typeof projectData.startDate !== "string" ||
		typeof projectData.creatorMotivation !== "string" ||
		typeof projectData.visibility !== "string" ||
		!Array.isArray(projectData.tags) ||
		!Array.isArray(projectData.talentsNeeded) ||
		!Array.isArray(projectData.objectives);
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!projectData.title) {
		return { status: "error", message: "Title is required." };
	}
	if (!projectData.categoryId) {
		return { status: "error", message: "Category is required." };
	}
	// Validate specific field constraints
	if (!validator.isLength(projectData.title, { min: 4, max: 100 })) {
		return { status: "error", message: "Title must be 4-100 characters." };
	}
	if (projectData.goal && !validator.isLength(projectData.goal, { min: 10, max: 500 })) {
		return { status: "error", message: "Goal must be 10-500 characters." };
	}
	if (projectData.summary && !validator.isLength(projectData.summary, { min: 10, max: 300 })) {
		return { status: "error", message: "Summary must be 10-300 characters." };
	}
	if (projectData.description && !validator.isLength(projectData.description, { min: 20, max: 10000 })) {
		return { status: "error", message: "Description must be 20-2000 characters." };
	}
	if (projectData.visibility && !validator.isIn(projectData.visibility, projectVisibility)) {
		return { status: "error", message: "Invalid project visibility." };
	}

	// If all validations passed
	return { status: "success", message: "All project inputs are valid." };
};

const validateSubmittedProjectInputs = (projectData) => {
	//Types validation
	const invalidType =
		typeof projectData.title !== "string" ||
		typeof projectData.goal !== "string" ||
		typeof projectData.summary !== "string" ||
		typeof projectData.description !== "string" ||
		typeof projectData.categoryId !== "string" ||
		typeof projectData.subCategory !== "string" ||
		typeof projectData.locationCountry !== "string" ||
		typeof projectData.locationCity !== "string" ||
		(typeof projectData.locationOnlineOnly !== "boolean" && projectData.locationOnlineOnly !== "no value passed") ||
		typeof projectData.startDate !== "string" ||
		typeof projectData.creatorMotivation !== "string" ||
		typeof projectData.visibility !== "string" ||
		!Array.isArray(projectData.tags) ||
		!Array.isArray(projectData.talentsNeeded) ||
		!Array.isArray(projectData.objectives);
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
	if (!projectData.visibility) {
		return { status: "error", message: "Visibility is required." };
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
	if (!validator.isIn(projectData.visibility, projectVisibility)) {
		return { status: "error", message: "Invalid project visibility." };
	}

	// If all validations passed
	return { status: "success", message: "All project inputs are valid." };
};

const validateUpdatedProjectInputs = (projectData) => {
	//String type validation
	const invalidType =
		typeof projectData.title !== "string" ||
		typeof projectData.goal !== "string" ||
		typeof projectData.summary !== "string" ||
		typeof projectData.description !== "string" ||
		typeof projectData.locationCountry !== "string" ||
		typeof projectData.locationCity !== "string" ||
		(typeof projectData.locationOnlineOnly !== "boolean" && projectData.locationOnlineOnly !== "no value passed") ||
		typeof projectData.startDate !== "string" ||
		typeof projectData.phase !== "string" ||
		typeof projectData.creatorMotivation !== "string" ||
		typeof projectData.visibility !== "string" ||
		!Array.isArray(projectData.tags) ||
		!Array.isArray(projectData.talentsNeeded) ||
		!Array.isArray(projectData.objectives);
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Validate specific field constraints
	if (projectData.title && !validator.isLength(projectData.title, { min: 4, max: 100 })) {
		return { status: "error", message: "Title must be 4-100 characters." };
	}
	if (projectData.goal && !validator.isLength(projectData.goal, { min: 10, max: 500 })) {
		return { status: "error", message: "Goal must be 10-500 characters." };
	}
	if (projectData.summary && !validator.isLength(projectData.summary, { min: 10, max: 300 })) {
		return { status: "error", message: "Summary must be 10-300 characters." };
	}
	if (projectData.description && !validator.isLength(projectData.description, { min: 20, max: 10000 })) {
		return { status: "error", message: "Description must be 20-2000 characters." };
	}
	if (projectData.visibility && !validator.isIn(projectData.visibility, projectVisibility)) {
		return { status: "error", message: "Invalid project visibility." };
	}

	// If all validations passed
	return { status: "success", message: "All project inputs are valid." };
};

const validateProjectIdAndUserId = (projectId, userId, requiredStatus) => {
	//Types validation
	const invalidType = typeof projectId !== "string" || typeof userId !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!projectId && requiredStatus === "mandatory") {
		return { status: "error", message: "Project ID is required." };
	}

	if (!userId) {
		return { status: "error", message: "User ID is required." };
	}

	// If all validations passed
	return { status: "success", message: "Project ID and user ID are valid." };
};

const validateProjectApproval = (projectApproval) => {
	//Type validation
	if (typeof projectApproval.approval !== "string" || typeof projectApproval.reason !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required field is present
	if (!projectApproval.approval) {
		return { status: "error", message: "Project approval is required." };
	}
	if (!validator.isIn(projectApproval.approval, projectApprovalList)) {
		return { status: "error", message: "Invalid project approval." };
	}

	// If all validations passed
	return { status: "success", message: "Project approval is valid." };
};

const validateProjectDraftInputs = (projectData) => {
	//Types validation
	const invalidType =
		typeof projectData.title !== "string" ||
		typeof projectData.goal !== "string" ||
		typeof projectData.summary !== "string" ||
		typeof projectData.description !== "string" ||
		typeof projectData.locationCountry !== "string" ||
		typeof projectData.locationCity !== "string" ||
		(typeof projectData.locationOnlineOnly !== "boolean" && projectData.locationOnlineOnly !== "no value passed") ||
		typeof projectData.startDate !== "string" ||
		typeof projectData.phase !== "string" ||
		typeof projectData.creatorMotivation !== "string" ||
		typeof projectData.visibility !== "string" ||
		!Array.isArray(projectData.tags) ||
		!Array.isArray(projectData.talentsNeeded) ||
		!Array.isArray(projectData.objectives);
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Validate specific field constraints
	if (projectData.title && !validator.isLength(projectData.title, { min: 4, max: 100 })) {
		return { status: "error", message: "Title must be 4-100 characters." };
	}
	if (projectData.goal && !validator.isLength(projectData.goal, { min: 10, max: 500 })) {
		return { status: "error", message: "Goal must be 10-500 characters." };
	}
	if (projectData.summary && !validator.isLength(projectData.summary, { min: 10, max: 300 })) {
		return { status: "error", message: "Summary must be 10-300 characters." };
	}
	if (projectData.description && !validator.isLength(projectData.description, { min: 20, max: 10000 })) {
		return { status: "error", message: "Description must be 20-2000 characters." };
	}
	if (projectData.visibility && !validator.isIn(projectData.visibility, projectVisibility)) {
		return { status: "error", message: "Invalid project visibility." };
	}

	// If all validations passed
	return { status: "success", message: "All project inputs are valid." };
};

const validateAttachmentTitle = (attachmentTitle) => {
	//Types validation
	if (typeof attachmentTitle !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!attachmentTitle) {
		return { status: "error", message: "Attachment title is required." };
	}

	// If all validations passed
	return { status: "success", message: "Attachment title is valid." };
};

const validateAttachmentKey = (attachmentKey) => {
	//Types validation
	if (typeof attachmentKey !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!attachmentKey) {
		return { status: "error", message: "Attachment key is required." };
	}

	// If all validations passed
	return { status: "success", message: "Attachment key is valid." };
};

const validateAttachmentKeyAndTitle = (attachmentKey, attachmentTitle) => {
	//Types validation
	if (typeof attachmentKey !== "string" || typeof attachmentTitle !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!attachmentKey) {
		return { status: "error", message: "Attachment key is required." };
	}
	if (!attachmentTitle) {
		return { status: "error", message: "Attachment title is required." };
	}

	// If all validations passed
	return { status: "success", message: "Attachment key and title are valid." };
};

module.exports = {
	validateDraftProjectInputs,
	validateSubmittedProjectInputs,
	validateUpdatedProjectInputs,
	validateProjectIdAndUserId,
	validateProjectApproval,
	validateProjectDraftInputs,
	validateAttachmentTitle,
	validateAttachmentKey,
	validateAttachmentKeyAndTitle,
};
