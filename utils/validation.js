const assert = require("assert");
const validator = require("validator");

const validateRegistrationInputs = function (username, email, password, confirmPassword) {
	//String type validation
	const invalidType =
		typeof username !== "string" ||
		typeof email !== "string" ||
		typeof password !== "string" ||
		typeof confirmPassword !== "string";

	if (invalidType) {
		return { status: "error", message: "Invalid type of data" };
	}

	try {
		assert(username, "Username required");
		assert(email, "Email required");
		assert(password, "Password required");
		assert(confirmPassword, "Password confirmation required");

		assert(
			validator.isAlphanumeric(username, "en-US", { ignore: "_-" }),
			"Username can contain letters, numbers, dashes and underscores"
		);
		assert(validator.isLength(username, { min: 3, max: 32 }), "Username can be 3-32 characters");
		assert(validator.isEmail(email), "Email wrongly formatted");
		assert(validator.isLength(email, { min: 2, max: 80 }), "Email can contain up to 80 characters");
		assert(
			validator.isLength(password, { min: 1, max: 125 }),
			"Password can contain up to 125 characters"
		);
		assert.deepStrictEqual(password, confirmPassword, "Password and confirmation don't match");
		assert(
			validator.isStrongPassword(password, {
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			}),
			"Password must contain at least 8 characters, a lower case letter, an upper case letter, a number and a special character"
		);

		return { status: "success", message: "All registration inputs are valid" };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	validateRegistrationInputs,
};
