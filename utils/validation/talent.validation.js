const validateTalentInputs = (talentData) => {
	//Types validation
	const invalidType =
		typeof talentData.name !== "string" ||
		typeof talentData.description !== "string" ||
		typeof talentData.skills !== "string" ||
		typeof talentData.experience !== "string" ||
		typeof talentData.portfolio !== "string" ||
		typeof talentData.certifications !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!talentData.name || talentData.name === "@--empty--string") {
		return { status: "error", message: "Talent name is required." };
	}

	// If all validations passed
	return { status: "success", message: "All talent inputs are valid." };
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

module.exports = {
	validateTalentInputs,
	validateTalentName,
};
