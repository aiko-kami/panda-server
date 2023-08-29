const validator = require("validator");

const validatePassword = (password, confirmPassword) => {
	// Validate password
	if (!password) {
		return { status: "error", message: "Password required." };
	}
	if (!confirmPassword) {
		return { status: "error", message: "Password confirmation required." };
	}
	if (!validator.isLength(password, { min: 1, max: 125 })) {
		return { status: "error", message: "Password can contain up to 125 characters." };
	}
	if (password !== confirmPassword) {
		return { status: "error", message: "Password and confirmation don't match." };
	}
	const strongPassword = validator.isStrongPassword(password, {
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	});
	if (!strongPassword) {
		return {
			status: "error",
			message:
				"Password must contain at least 8 characters, a lowercase letter, an uppercase letter, a number, and a special character.",
		};
	}
	return { status: "success" };
};

const validateRegistrationInputs = (username, email, password, confirmPassword) => {
	//String type validation
	const invalidType =
		typeof username !== "string" ||
		typeof email !== "string" ||
		typeof password !== "string" ||
		typeof confirmPassword !== "string";

	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!username) {
		return { status: "error", message: "Username required." };
	}
	if (!email) {
		return { status: "error", message: "Email required." };
	}
	if (!validator.isAlphanumeric(username, "en-US", { ignore: "_-" })) {
		return {
			status: "error",
			message: "Username can contain letters, numbers, dashes and underscores.",
		};
	}
	if (!validator.isLength(username, { min: 3, max: 32 })) {
		return { status: "error", message: "Username can be 3-32 characters." };
	}
	if (!validator.isLength(email, { min: 1, max: 255 })) {
		return { status: "error", message: "Email can contain up to 255 characters." };
	}
	if (!validator.isEmail(email)) {
		return { status: "error", message: "Email wrongly formatted." };
	}
	// Validate password
	const passwordValidationResult = validatePassword(password, confirmPassword);
	if (passwordValidationResult.status === "error") {
		return passwordValidationResult; // Return the error result from validatePassword
	}
	return { status: "success", message: "All registration inputs are valid." };
};

const validateLoginInputs = (identifier, password) => {
	// String type validation
	const invalidType = typeof identifier !== "string" || typeof password !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Validate identifier (email or username)
	if (!identifier) {
		return { status: "error", message: "Identifier is required." };
	}
	// Validate password
	if (!password) {
		return { status: "error", message: "Password is required." };
	}
	return { status: "success", message: "All login inputs are valid." };
};

const validateEmail = (email) => {
	//String type validation
	if (typeof email !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!email) {
		return { status: "error", message: "Email required." };
	}
	//Check email validity
	if (!validator.isEmail(email)) {
		return { status: "error", message: "Email wrongly formatted." };
	}
	return { status: "success" };
};

const validateNewProjectInputs = (projectData) => {
	//String type validation
	const invalidType =
		typeof projectData.title !== "string" ||
		typeof projectData.goal !== "string" ||
		typeof projectData.summary !== "string" ||
		typeof projectData.description !== "string" ||
		typeof projectData.categoryId !== "string" ||
		typeof projectData.subCategoryId !== "string" ||
		typeof projectData.tagsIds !== "string" ||
		typeof projectData.members !== "string" ||
		typeof projectData.location.city !== "string" ||
		typeof projectData.location.country !== "string" ||
		typeof projectData.skillsNeeded !== "string" ||
		typeof projectData.startDate !== "number" ||
		typeof projectData.projectObjectives !== "string" ||
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
	if (!projectData.skillsNeeded) {
		return { status: "error", message: "Skills needed are required." };
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
	validatePassword,
	validateRegistrationInputs,
	validateLoginInputs,
	validateEmail,
	validateNewProjectInputs,
};
