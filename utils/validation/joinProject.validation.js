const validateJoinProjectInputs = (joinProjectData) => {
	//Types validation
	const invalidType =
		typeof joinProjectData.userIdSender !== "string" || typeof joinProjectData.projectId !== "string" || typeof joinProjectData.role !== "string" || typeof joinProjectData.message !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!joinProjectData.userIdSender) {
		return { status: "error", message: "Sender user ID is required." };
	}
	if (!joinProjectData.projectId) {
		return { status: "error", message: "Project ID is required." };
	}

	// Verify role is in the standard list
	if (joinProjectData.joinProjectType === "join project invitation") {
		if (typeof joinProjectData.userIdReceiver !== "string") {
			return { status: "error", message: "Invalid type of data." };
		}

		if (!joinProjectData.userIdReceiver) {
			return { status: "error", message: "Receiver user ID is required." };
		}
	}

	// If all validations passed
	return { status: "success", message: "All join project inputs are valid." };
};

const validateJoinProjectIdAndSender = (joinProjectId, userIdSender) => {
	//Types validation
	const invalidType = typeof userIdSender !== "string" || typeof joinProjectId !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!userIdSender) {
		return { status: "error", message: "Sender user ID is required." };
	}

	// Check if required fields are present
	if (!joinProjectId) {
		return { status: "error", message: "Join project ID is required." };
	}

	// If all validations passed
	return { status: "success", message: "Join project ID and sender user ID are valid." };
};

module.exports = {
	validateJoinProjectInputs,
	validateJoinProjectIdAndSender,
};
