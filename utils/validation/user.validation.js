const validator = require("validator");

const validateUpdatedUserInputs = (userData) => {
	//String type validation
	const invalidType =
		typeof userData.email !== "string" ||
		typeof userData.profilePicture !== "string" ||
		typeof userData.locationCountry !== "string" ||
		typeof userData.locationCity !== "string" ||
		typeof userData.company !== "string" ||
		typeof userData.description !== "string" ||
		typeof userData.bio !== "string" ||
		typeof userData.website !== "string" ||
		!Array.isArray(userData.languages);
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Validate specific field constraints
	if (userData.email && !validator.isLength(userData.email, { min: 1, max: 255 })) {
		return { status: "error", message: "Email can contain up to 255 characters." };
	}
	if (userData.email && !validator.isEmail(userData.email)) {
		return { status: "error", message: "Email wrongly formatted." };
	}
	// If all validations passed
	return { status: "success", message: "All user inputs are valid." };
};

module.exports = {
	validateUpdatedUserInputs,
};