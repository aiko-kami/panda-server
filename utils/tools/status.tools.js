function getAllowedProjectStatuses(statusesList, currentStatus) {
	if (!currentStatus || !currentStatus.status) return [];

	const transitions = {
		draft: ["draft", "submitted", "cancelled"],
		submitted: ["submitted", "draft", "active", "rejected", "cancelled"],
		active: ["active", "on hold", "completed", "cancelled"],
		"on hold": ["on hold", "active", "completed", "cancelled"],
		completed: ["completed", "active", "archived"],
		rejected: ["rejected", "archived", "draft"],
	};

	const current = currentStatus.status.toLowerCase();
	const allowed = transitions[current] || [];

	return statusesList.filter((s) => allowed.includes(s.status.toLowerCase()));
}

const validateProjectStatusUpdate = (newStatus, formerStatus) => {
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

	if (formerStatus === "rejected" && newStatus !== "archived" && newStatus !== "draft") {
		return { status: "error", message: `Status cannot be updated from ${formerStatus.toUpperCase()} to ${newStatus.toUpperCase()}.` };
	}

	return { status: "success" };
};

function getAllowedJoinProjectStatusesForSender(statusesList, currentStatus) {
	if (!currentStatus || !currentStatus.status) return [];

	const transitions = {
		draft: ["sent", "cancelled"],
		sent: ["cancelled"],
		read: ["cancelled"],
	};

	const current = currentStatus.status.toLowerCase();
	const allowed = transitions[current] || [];

	return statusesList.filter((s) => allowed.includes(s.status.toLowerCase()));
}

function getAllowedJoinProjectStatusesForReceiver(statusesList, currentStatus) {
	if (!currentStatus || !currentStatus.status) return [];

	const transitions = {
		sent: ["read", "accepted", "refused"],
		read: ["accepted", "refused"],
	};

	const current = currentStatus.status.toLowerCase();
	const allowed = transitions[current] || [];

	return statusesList.filter((s) => allowed.includes(s.status.toLowerCase()));
}

const validateJoinProjectStatusUpdate = (requestType, newStatus, formerStatus) => {
	// Check if the new status is different from the current one
	if (formerStatus === newStatus) {
		return {
			status: "error",
			message: `${requestType.charAt(0).toUpperCase() + requestType.slice(1)} is already in status: ${newStatus.toUpperCase()}. New status must be different from the former one.`,
		};
	}

	// Check if the status can be updated
	if (formerStatus === "draft" && newStatus !== "sent" && newStatus !== "cancelled") {
		return { status: "error", message: `Status cannot be updated from ${formerStatus.toUpperCase()} to ${newStatus.toUpperCase()}.` };
	}

	if (formerStatus === "sent" && newStatus !== "read" && newStatus !== "accepted" && newStatus !== "refused" && newStatus !== "cancelled") {
		return { status: "error", message: `Status cannot be updated from ${formerStatus.toUpperCase()} to ${newStatus.toUpperCase()}.` };
	}

	if (formerStatus === "read" && newStatus !== "accepted" && newStatus !== "refused" && newStatus !== "cancelled") {
		return { status: "error", message: `Status cannot be updated from ${formerStatus.toUpperCase()} to ${newStatus.toUpperCase()}.` };
	}

	if (formerStatus === "accepted" || formerStatus === "refused" || formerStatus === "cancelled") {
		return { status: "error", message: `Status cannot be updated anymore because ${requestType.charAt(0).toUpperCase() + requestType.slice(1)} has been ${formerStatus}.` };
	}

	return { status: "success" };
};

module.exports = {
	getAllowedProjectStatuses,
	validateProjectStatusUpdate,
	getAllowedJoinProjectStatusesForSender,
	getAllowedJoinProjectStatusesForReceiver,
	validateJoinProjectStatusUpdate,
};
