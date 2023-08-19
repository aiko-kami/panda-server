const assert = require("assert");
const validator = require("validator");

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

	try {
		assert(username, "Username required.");
		assert(email, "Email required.");
		assert(password, "Password required.");
		assert(confirmPassword, "Password confirmation required.");

		assert(
			validator.isAlphanumeric(username, "en-US", { ignore: "_-" }),
			"Username can contain letters, numbers, dashes and underscores."
		);
		assert(validator.isLength(username, { min: 3, max: 32 }), "Username can be 3-32 characters.");
		assert(validator.isEmail(email), "Email wrongly formatted.");
		assert(
			validator.isLength(email, { min: 2, max: 80 }),
			"Email can contain up to 80 characters."
		);
		assert(
			validator.isLength(password, { min: 1, max: 125 }),
			"Password can contain up to 125 characters."
		);
		assert.deepStrictEqual(password, confirmPassword, "Password and confirmation don't match.");
		assert(
			validator.isStrongPassword(password, {
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			}),
			"Password must contain at least 8 characters, a lower case letter, an upper case letter, a number and a special character."
		);
		return { status: "success", message: "All registration inputs are valid." };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const validateLoginInputs = (identifier, password) => {
	// String type validation
	const invalidType = typeof identifier !== "string" || typeof password !== "string";

	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	try {
		// Validate identifier (email or username)
		if (validator.isEmpty(identifier)) {
			throw new Error("Identifier is required.");
		}

		// Validate password
		if (validator.isEmpty(password)) {
			throw new Error("Password is required.");
		}

		return { status: "success", message: "All login inputs are valid." };
	} catch (bodyError) {
		return { status: "error", message: bodyError.message };
	}
};

const validateEmail = (email) => {
	//String type validation
	if (typeof email !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}

	//Check email validity
	try {
		assert(email, "Email required");
		assert(validator.isEmail(email), "Email wrongly formatted.");
		return { status: "success" };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const validatePassword = (password, confirmPassword) => {
	// Validate password using assertions
	try {
		assert(password, "Password required.");
		assert(confirmPassword, "Password confirmation required.");
		assert(
			validator.isLength(password, { min: 1, max: 125 }),
			"Password can contain up to 125 characters."
		);
		assert.deepStrictEqual(password, confirmPassword, "Password and confirmation don't match.");
		assert(
			validator.isStrongPassword(password, {
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			}),
			"Password must contain at least 8 characters, a lowercase letter, an uppercase letter, a number, and a special character."
		);
		return { status: "success" };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	validateRegistrationInputs,
	validateLoginInputs,
	validateEmail,
	validatePassword,
};
