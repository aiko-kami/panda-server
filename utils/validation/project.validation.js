const validator = require("validator");
const config = require("../../config");
const projectVisibility = config.project_visibility;
const projectApprovalList = config.project_approval;
const projectTitleMinLength = config.project_title_min_length;
const projectTitleMaxLength = config.project_title_max_length;
const projectGoalMinLength = config.project_goal_min_length;
const projectGoalMaxLength = config.project_goal_max_length;
const projectSummaryMinLength = config.project_summary_min_length;
const projectSummaryMaxLength = config.project_summary_max_length;
const projectDescriptionMinLength = config.project_description_min_length;
const projectDescriptionMaxLength = config.project_description_max_length;

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
		!Array.isArray(projectData.objectives) ||
		!projectData.tags.every((tag) => typeof tag === "string") ||
		!projectData.talentsNeeded.every((t) => t && typeof t === "object" && typeof t.talent === "string" && typeof t.description === "string");
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!projectData.title) {
		return { status: "error", message: "Project title is required." };
	}
	if (!projectData.categoryId) {
		return { status: "error", message: "Project category is required." };
	}
	// Validate specific field constraints
	if (!validator.isLength(projectData.title, { min: projectTitleMinLength, max: projectTitleMaxLength })) {
		return { status: "error", message: `Project title must be ${projectTitleMinLength}-${projectTitleMaxLength} characters.` };
	}
	if (projectData.goal && !validator.isLength(projectData.goal, { min: projectGoalMinLength, max: projectGoalMaxLength })) {
		return { status: "error", message: `Project goal must be ${projectGoalMinLength}-${projectGoalMaxLength} characters.` };
	}
	if (projectData.summary && !validator.isLength(projectData.summary, { min: projectSummaryMinLength, max: projectSummaryMaxLength })) {
		return { status: "error", message: `Project summary must be ${projectSummaryMinLength}-${projectSummaryMaxLength} characters.` };
	}
	if (projectData.description && !validator.isLength(projectData.description, { min: projectDescriptionMinLength, max: projectDescriptionMaxLength })) {
		return { status: "error", message: `Project description must be ${projectDescriptionMinLength}-${projectDescriptionMaxLength} characters.` };
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
		!Array.isArray(projectData.objectives) ||
		!projectData.tags.every((tag) => typeof tag === "string") ||
		!projectData.objectives.every((obj) => typeof obj === "string") ||
		!projectData.talentsNeeded.every((t) => t && typeof t === "object" && typeof t.talent === "string" && typeof t.description === "string");

	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!projectData.title) {
		return { status: "error", message: "Project title is required." };
	}
	if (!projectData.goal) {
		return { status: "error", message: "Project goal is required." };
	}
	if (!projectData.summary) {
		return { status: "error", message: "Project summary is required." };
	}
	if (!projectData.description) {
		return { status: "error", message: "Project description is required." };
	}
	if (!projectData.categoryId) {
		return { status: "error", message: "Project category is required." };
	}
	if (projectData.talentsNeeded.length == 0) {
		return { status: "error", message: "Talents needed are required." };
	}
	if (!projectData.visibility) {
		return { status: "error", message: "Project visibility is required." };
	}
	// Validate specific field constraints
	if (!validator.isLength(projectData.title, { min: projectTitleMinLength, max: projectTitleMaxLength })) {
		return { status: "error", message: `Project title must be ${projectTitleMinLength}-${projectTitleMaxLength} characters.` };
	}
	if (!validator.isLength(projectData.goal, { min: projectGoalMinLength, max: projectGoalMaxLength })) {
		return { status: "error", message: `Project goal must be ${projectGoalMinLength}-${projectGoalMaxLength} characters.` };
	}
	if (!validator.isLength(projectData.summary, { min: projectSummaryMinLength, max: projectSummaryMaxLength })) {
		return { status: "error", message: `Project summary must be ${projectSummaryMinLength}-${projectSummaryMaxLength} characters.` };
	}
	if (!validator.isLength(projectData.description, { min: projectDescriptionMinLength, max: projectDescriptionMaxLength })) {
		return { status: "error", message: `Project description must be ${projectDescriptionMinLength}-${projectDescriptionMaxLength} characters.` };
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
		!Array.isArray(projectData.objectives) ||
		!projectData.tags.every((tag) => typeof tag === "string") ||
		!projectData.objectives.every((obj) => typeof obj === "string") ||
		!projectData.talentsNeeded.every((t) => t && typeof t === "object" && typeof t.talent === "string" && typeof t.description === "string");

	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Validate specific field constraints
	if (projectData.title && !validator.isLength(projectData.title, { min: projectTitleMinLength, max: projectTitleMaxLength })) {
		return { status: "error", message: `Project title must be ${projectTitleMinLength}-${projectTitleMaxLength} characters.` };
	}
	if (projectData.goal && !validator.isLength(projectData.goal, { min: projectGoalMinLength, max: projectGoalMaxLength })) {
		return { status: "error", message: `Project goal must be ${projectGoalMinLength}-${projectGoalMaxLength} characters.` };
	}
	if (projectData.summary && !validator.isLength(projectData.summary, { min: projectSummaryMinLength, max: projectSummaryMaxLength })) {
		return { status: "error", message: `Project summary must be ${projectSummaryMinLength}-${projectSummaryMaxLength} characters.` };
	}
	if (projectData.description && !validator.isLength(projectData.description, { min: projectDescriptionMinLength, max: projectDescriptionMaxLength })) {
		return { status: "error", message: `Project description must be ${projectDescriptionMinLength}-${projectDescriptionMaxLength} characters.` };
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

const validateProjectLinkAndUserId = (projectLink, userId, requiredStatus) => {
	//Types validation
	const invalidType = typeof projectLink !== "string" || typeof userId !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!projectLink && requiredStatus === "mandatory") {
		return { status: "error", message: "Project link is required." };
	}

	if (!userId) {
		return { status: "error", message: "User ID is required." };
	}

	// If all validations passed
	return { status: "success", message: "Project link and user ID are valid." };
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
		typeof projectData.creatorMotivation !== "string" ||
		typeof projectData.visibility !== "string" ||
		!Array.isArray(projectData.tags) ||
		!Array.isArray(projectData.talentsNeeded) ||
		!Array.isArray(projectData.objectives) ||
		!projectData.tags.every((tag) => typeof tag === "string") ||
		!projectData.objectives.every((obj) => typeof obj === "string") ||
		!projectData.talentsNeeded.every((t) => t && typeof t === "object" && typeof t.talent === "string" && typeof t.description === "string");

	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Validate specific field constraints
	if (projectData.title && !validator.isLength(projectData.title, { min: projectTitleMinLength, max: projectTitleMaxLength })) {
		return { status: "error", message: `Project title must be ${projectTitleMinLength}-${projectTitleMaxLength} characters.` };
	}
	if (projectData.goal && !validator.isLength(projectData.goal, { min: projectGoalMinLength, max: projectGoalMaxLength })) {
		return { status: "error", message: `Project goal must be ${projectGoalMinLength}-${projectGoalMaxLength} characters.` };
	}
	if (projectData.summary && !validator.isLength(projectData.summary, { min: projectSummaryMinLength, max: projectSummaryMaxLength })) {
		return { status: "error", message: `Project summary must be ${projectSummaryMinLength}-${projectSummaryMaxLength} characters.` };
	}
	if (projectData.description && !validator.isLength(projectData.description, { min: projectDescriptionMinLength, max: projectDescriptionMaxLength })) {
		return { status: "error", message: `Project description must be ${projectDescriptionMinLength}-${projectDescriptionMaxLength} characters.` };
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

const validateObjectiveInputs = (userIdUpdater, projectId, objective) => {
	//Types validation
	const invalidType = typeof userIdUpdater !== "string" || typeof projectId !== "string" || typeof objective !== "string";
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
	if (!objective) {
		return { status: "error", message: "Objective is required." };
	}

	// If all validations passed
	return { status: "success", message: "All objective inputs are valid." };
};

module.exports = {
	validateDraftProjectInputs,
	validateSubmittedProjectInputs,
	validateUpdatedProjectInputs,
	validateProjectIdAndUserId,
	validateProjectLinkAndUserId,
	validateProjectApproval,
	validateProjectDraftInputs,
	validateAttachmentTitle,
	validateAttachmentKey,
	validateAttachmentKeyAndTitle,
	validateObjectiveInputs,
};
