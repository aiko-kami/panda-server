const validator = require("validator");
const config = require("../../config");
const userVisibility = config.user_visibility;
const websiteDisplayMode = config.website_display_mode;
const websiteAppearance = config.website_appearance;
const websiteLanguage = config.website_language;
const userEmailMinLength = config.user_email_min_length;
const userEmailMaxLength = config.user_email_max_length;
const userDescriptionMaxLength = config.user_description_max_length;
const userBioMaxLength = config.user_bio_max_length;

const validateUserInputs = (userData) => {
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

const validateUserBioDescription = (userData) => {
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

const validateUserDetails = (userData) => {
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

const validateUserPrivacyInputs = (userPrivacyData) => {
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

const validateDisplayModeSettingsInputs = (displayModeSettingsData) => {
	//String type validation
	const invalidType = typeof displayModeSettingsData.displayMode !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Validate language
	if (!validator.isIn(displayModeSettingsData.displayMode, websiteDisplayMode)) {
		return { status: "error", message: `Invalid value for display mode.` };
	}

	// If all validations passed
	return { status: "success", message: "All user inputs are valid." };
};

const validateAppearanceSettingsInputs = (AppearanceSettingsData) => {
	//String type validation
	const invalidType = typeof AppearanceSettingsData.appearance !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Validate language
	if (!validator.isIn(AppearanceSettingsData.appearance, websiteAppearance)) {
		return { status: "error", message: `Invalid value for appearance.` };
	}

	// If all validations passed
	return { status: "success", message: "All user inputs are valid." };
};

const validateLanguageSettingsInputs = (languageSettingsData) => {
	//String type validation
	const invalidType = typeof languageSettingsData.language !== "string";

	console.log("🚀 ~ validateLanguageSettingsInputs ~ languageSettingsData:", languageSettingsData);

	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Validate language
	if (!validator.isIn(languageSettingsData.language, websiteLanguage)) {
		return { status: "error", message: `Invalid value for language.` };
	}

	// If all validations passed
	return { status: "success", message: "All user inputs are valid." };
};

const validateNotificationsInputs = (notificationsData) => {
	// Iterate over each key in notificationsData
	for (let key in notificationsData) {
		if (Object.prototype.hasOwnProperty.call(notificationsData, key)) {
			// Validate type
			if (typeof notificationsData[key] !== "boolean") {
				return { status: "error", message: "Invalid type of data." };
			}
		}
	}

	// If all validations passed
	return { status: "success", message: "All user inputs are valid." };
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
	validateUserInputs,
	validateUserBioDescription,
	validateUserDetails,
	validateUserPrivacyInputs,
	validateDisplayModeSettingsInputs,
	validateAppearanceSettingsInputs,
	validateLanguageSettingsInputs,
	validateNotificationsInputs,
	validateUserId,
};
