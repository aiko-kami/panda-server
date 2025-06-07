const validator = require("validator");

const config = require("../../config");
const userEmailMinLength = config.user_email_min_length;
const userEmailMaxLength = config.user_email_max_length;
const userUsernameMinLength = config.user_username_min_length;
const userUsernameMaxLength = config.user_username_max_length;
const userPasswordMinLength = config.user_password_min_length;
const userPasswordMaxLength = config.user_password_max_length;

const validatePasswordChange = (oldPassword, newPassword, confirmNewPassword) => {
	// Validate password
	if (!oldPassword) {
		return { status: "error", message: "Old password required." };
	}
	if (!newPassword) {
		return { status: "error", message: "New password required." };
	}
	if (!confirmNewPassword) {
		return { status: "error", message: "Password confirmation required." };
	}
	if (!validator.isLength(newPassword, { min: 1, max: userPasswordMaxLength })) {
		return { status: "error", message: `Password can contain up to ${userPasswordMaxLength} characters.` };
	}
	if (newPassword === oldPassword) {
		return { status: "error", message: "Old password and new password must be different." };
	}
	if (newPassword !== confirmNewPassword) {
		return { status: "error", message: "Password and confirmation don't match." };
	}
	const strongPassword = validator.isStrongPassword(newPassword, {
		minLength: userPasswordMinLength,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	});
	if (!strongPassword) {
		return {
			status: "error",
			message: `Password must contain at least ${userPasswordMinLength} characters, a lowercase letter, an uppercase letter, a number, and a special character.`,
		};
	}
	return { status: "success" };
};

const validatePassword = (password, confirmPassword) => {
	// Validate password
	if (!password) {
		return { status: "error", message: "Password required." };
	}
	if (!confirmPassword) {
		return { status: "error", message: "Password confirmation required." };
	}
	if (!validator.isLength(password, { min: 1, max: userPasswordMaxLength })) {
		return { status: "error", message: `Password can contain up to ${userPasswordMaxLength} characters.` };
	}
	if (password !== confirmPassword) {
		return { status: "error", message: "Password and confirmation don't match." };
	}
	const strongPassword = validator.isStrongPassword(password, {
		minLength: userPasswordMinLength,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	});
	if (!strongPassword) {
		return {
			status: "error",
			message: `Password must contain at least ${userPasswordMinLength} characters, a lowercase letter, an uppercase letter, a number, and a special character.`,
		};
	}
	return { status: "success" };
};

const validateRegistrationInputs = (username, email, password, confirmPassword) => {
	//String type validation
	const invalidType = typeof username !== "string" || typeof email !== "string" || typeof password !== "string" || typeof confirmPassword !== "string";

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
	if (!validator.isLength(username, { min: userUsernameMinLength, max: userUsernameMaxLength })) {
		return { status: "error", message: `Username can be ${userUsernameMinLength}-${userUsernameMaxLength} characters.` };
	}
	if (!validator.isLength(email, { min: userEmailMinLength, max: userEmailMaxLength })) {
		return { status: "error", message: `Email can contain up to ${userEmailMaxLength} characters.` };
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

module.exports = {
	validatePasswordChange,
	validatePassword,
	validateRegistrationInputs,
	validateLoginInputs,
	validateEmail,
};
