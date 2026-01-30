const validateTalentInputs = (talentData) => {
	//Types validation
	const invalidType =
		typeof talentData.name !== "string" ||
		typeof talentData.description !== "string" ||
		!Array.isArray(talentData.skills) ||
		!talentData.skills.every((sk) => typeof sk === "string") ||
		typeof talentData.experience !== "string" ||
		typeof talentData.portfolio !== "string" ||
		!Array.isArray(talentData.certifications) ||
		!talentData.certifications.every((cert) => typeof cert === "string") ||
		typeof talentData.published !== "boolean";

	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!talentData.name || talentData.name === "@--empty--string") {
		return { status: "error", message: "Talent name is required." };
	}
	if (!talentData.description || talentData.description === "@--empty--string") {
		return { status: "error", message: "Talent description is required." };
	}

	// If all validations passed
	return { status: "success", message: "All talent inputs are valid." };
};

const validateTalentsInputs = (talentsData) => {
	for (const talentData of talentsData) {
		const validationResult = validateTalentInputs(talentData);
		if (validationResult.status !== "success") {
			return validationResult;
		}
	}

	// Check for duplicate talent names
	const talentNames = talentsData.map((talent) => talent.name.trim().toLowerCase());
	const uniqueTalentNames = new Set(talentNames);
	if (uniqueTalentNames.size !== talentNames.length) {
		return { status: "error", message: "Duplicate talent names are not allowed." };
	}

	return { status: "success", message: "All talents inputs are valid." };
};

const validateTalentName = (talentName) => {
	//Types validation
	if (typeof talentName !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!talentName) {
		return { status: "error", message: "Talent name is required." };
	}

	// If all validations passed
	return { status: "success", message: "All talent inputs are valid." };
};

const validateSkillInput = (skill) => {
	//Type validation
	if (typeof skill !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!skill) {
		return { status: "error", message: "Skill is required." };
	}

	// If all validations passed
	return { status: "success", message: "All skill inputs are valid." };
};

module.exports = {
	validateTalentInputs,
	validateTalentsInputs,
	validateTalentName,
	validateSkillInput,
};
