const validator = require("validator");
const config = require("../../config");
const projectMembersRoles = config.project_members_roles;

const validateMemberInputs = (userIdUpdater, projectId, memberId, newRole, newStartDate, newTalent) => {
	//Types validation
	const invalidType =
		typeof userIdUpdater !== "string" ||
		typeof projectId !== "string" ||
		typeof memberId !== "string" ||
		typeof newRole !== "string" ||
		typeof newStartDate !== "string" ||
		typeof newTalent !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!userIdUpdater) {
		return { status: "error", message: "Updater user ID is required." };
	}
	if (!projectId) {
		return { status: "error", message: "Project ID is required." };
	}
	if (!memberId) {
		return { status: "error", message: "Member ID is required." };
	}

	// Verify role is in the standard list
	if (newRole) {
		if (!validator.isIn(newRole, projectMembersRoles)) {
			return { status: "error", message: "Invalid member role." };
		}
	}

	// Verify date format is correct
	if (newStartDate) {
		if (!validator.isDate(newStartDate, { format: "YYYY/MM/DD", strictMode: true })) {
			return { status: "error", message: "Invalid start date format." };
		}
	}

	// If all validations passed
	return { status: "success", message: "All member inputs are valid." };
};

const validateJoinProjectInputs = (joinProjectType, userIdSender, projectId, role, message, userIdReceiver) => {
	//Types validation
	const invalidType = typeof userIdSender !== "string" || typeof projectId !== "string" || typeof role !== "string" || typeof message !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!userIdSender) {
		return { status: "error", message: "Sender user ID is required." };
	}
	if (!projectId) {
		return { status: "error", message: "Project ID is required." };
	}

	// Verify role is in the standard list
	if (joinProjectType === "invitation") {
		if (typeof userIdReceiver !== "string") {
			return { status: "error", message: "Invalid type of data." };
		}

		if (!userIdReceiver) {
			return { status: "error", message: "Receiver user ID is required." };
		}
	}

	// If all validations passed
	return { status: "success", message: "All join project inputs are valid." };
};

module.exports = {
	validateMemberInputs,
	validateJoinProjectInputs,
};
