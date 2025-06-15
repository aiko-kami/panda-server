const validator = require("validator");
const config = require("../../config");
const userVisibility = config.user_visibility;
const userEmailMinLength = config.user_email_min_length;
const userEmailMaxLength = config.user_email_max_length;
const userDescriptionMaxLength = config.user_description_max_length;
const userBioMaxLength = config.user_bio_max_length;

const validateUpdatedUserInputs = (userData) => {
	//String type validation
	const invalidType =
		typeof userData.email !== "string" ||
		typeof userData.locationCountry !== "string" ||
		typeof userData.locationCity !== "string" ||
		typeof userData.company !== "string" ||
		typeof userData.description !== "string" ||
		typeof userData.bio !== "string" ||
		typeof userData.website !== "string" ||
		!Array.isArray(userData.languages) ||
		!userData.languages.every((lang) => typeof lang === "string");
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Validate specific field constraints
	if (userData.email && !validator.isLength(userData.email, { min: userEmailMinLength, max: userEmailMaxLength })) {
		return { status: "error", message: `Email can contain up to ${userEmailMaxLength} characters.` };
	}
	// Validate email type
	if (userData.email && !validator.isEmail(userData.email)) {
		return { status: "error", message: "Email wrongly formatted." };
	}
	// Validate specific field constraints
	if (userData.description && !validator.isLength(userData.description, { max: userDescriptionMaxLength })) {
		return { status: "error", message: `User description can contain up to ${userDescriptionMaxLength} characters.` };
	}
	// Validate specific field constraints
	if (userData.bio && !validator.isLength(userData.bio, { max: userBioMaxLength })) {
		return { status: "error", message: `User bio can contain up to ${userBioMaxLength} characters.` };
	}
	// If all validations passed
	return { status: "success", message: "All user inputs are valid." };
};

const validateUpdatedUserBioDescription = (userData) => {
	//String type validation
	const invalidType = typeof userData.description !== "string" || typeof userData.bio !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Validate specific field constraints
	if (userData.description && !validator.isLength(userData.description, { max: userDescriptionMaxLength })) {
		return { status: "error", message: `User description can contain up to ${userDescriptionMaxLength} characters.` };
	}
	// Validate specific field constraints
	if (userData.bio && !validator.isLength(userData.bio, { max: userBioMaxLength })) {
		return { status: "error", message: `User bio can contain up to ${userBioMaxLength} characters.` };
	}
	// If all validations passed
	return { status: "success", message: "All user inputs are valid." };
};

const validateUpdatedUserDetails = (userData) => {
	//String type validation
	const invalidType =
		typeof userData.locationCountry !== "string" ||
		typeof userData.locationCity !== "string" ||
		typeof userData.company !== "string" ||
		typeof userData.website !== "string" ||
		!Array.isArray(userData.languages) ||
		!userData.languages.every((lang) => typeof lang === "string");
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	// If all validations passed
	return { status: "success", message: "All user inputs are valid." };
};

const validateUpdatedUserPrivacyInputs = (userPrivacyData) => {
	// Iterate over each key in userPrivacyData
	for (let key in userPrivacyData) {
		if (Object.prototype.hasOwnProperty.call(userPrivacyData, key)) {
			// Validate type
			if (typeof userPrivacyData[key] !== "string") {
				return { status: "error", message: "Invalid type of data." };
			}

			// Validate visibility
			if (userPrivacyData[key] && !validator.isIn(userPrivacyData[key], userVisibility)) {
				return { status: "error", message: `Invalid user visibility for ${key}.` };
			}
		}
	}
	// If all validations passed
	return { status: "success", message: "All user privacy inputs are valid." };
};

const validateUserId = (userId) => {
	//String type validation
	if (typeof userId !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	// If all validations passed
	return { status: "success", message: "All user inputs are valid." };
};

module.exports = {
	validateUpdatedUserInputs,
	validateUpdatedUserBioDescription,
	validateUpdatedUserDetails,
	validateUpdatedUserPrivacyInputs,
	validateUserId,
};
