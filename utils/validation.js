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

module.exports = {
	validatePassword,
	validateRegistrationInputs,
	validateLoginInputs,
	validateEmail,
};
