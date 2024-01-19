const validateStatusUpdate = (newStatus, formerStatus) => {
	// Check if the new status is different from the current one
	if (formerStatus === newStatus) {
		return { status: "error", message: `Project is already in status: ${newStatus.toUpperCase()}. New status must be different from the former one.` };
	}

	// Check if the status can be updated
	if (formerStatus === "draft" && newStatus !== "submitted" && newStatus !== "cancelled") {
		return { status: "error", message: `Status cannot be updated from ${formerStatus.toUpperCase()} to ${newStatus.toUpperCase()}.` };
	}

	if (formerStatus === "submitted" && newStatus !== "draft" && newStatus !== "cancelled") {
		return { status: "error", message: `Status cannot be updated from ${formerStatus.toUpperCase()} to ${newStatus.toUpperCase()}.` };
	}

	if ((formerStatus === "active" || formerStatus === "on hold" || formerStatus === "completed") && (newStatus === "draft" || newStatus === "submitted")) {
		return { status: "error", message: `Status cannot be updated from ${formerStatus.toUpperCase()} to ${newStatus.toUpperCase()}.` };
	}

	if (formerStatus === "archived" || formerStatus === "cancelled") {
		return { status: "error", message: `Status cannot be updated anymore because project has been ${formerStatus}.` };
	}

	return { status: "success" };
};

module.exports = {
	validateStatusUpdate,
};
