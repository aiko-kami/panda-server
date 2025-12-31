const validateUserProjectRightsIds = (userIdUpdater, projectId) => {
	//Types validation
	if (typeof userIdUpdater !== "string" || typeof projectId !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!userIdUpdater) {
		return { status: "error", message: "Updater user ID is required." };
	}
	if (!projectId) {
		return { status: "error", message: "Project ID is required." };
	}
	// If all validations pass, return success status
	return {
		status: "success",
		message: "Input data is valid.",
	};
};

const validateUserProjectRightsInputs = (member) => {
	//Types validation
	if (typeof member.userId !== "string" || typeof member.permissions !== "object") {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!member.userId) {
		return { status: "error", message: "Updated user ID is required." };
	}
	if (!member.permissions) {
		return { status: "error", message: "List of updated permissions is required." };
	}

	// Check if every element in member.permissions is a boolean
	for (const permission in member.permissions) {
		if (typeof member.permissions[permission] !== "boolean") {
			return {
				status: "error",
				message: "Invalid permission value(s). Permissions must be booleans.",
			};
		}
	}

	// If all validations pass, return success status
	return {
		status: "success",
		message: "Input data is valid.",
	};
};

const validateUsersProjectRightsInputs = (members) => {
	//Types validation
	if (!Array.isArray(members) || members.length === 0) {
		return { status: "error", message: "Members array is required." };
	}

	for (const member of members) {
		const memberValidation = validateUserProjectRightsInputs(member);
		if (memberValidation.status !== "success") {
			return memberValidation;
		}
	}

	// If all validations pass, return success status
	return {
		status: "success",
		message: "Input data is valid.",
	};
};

module.exports = {
	validateUserProjectRightsIds,
	validateUserProjectRightsInputs,
	validateUsersProjectRightsInputs,
};
