const validateSteps = (steps) => {
	//String type validation
	if (!Array.isArray(steps)) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if every element in updatedPermissions is a boolean
	for (const step of steps) {
		if (!step.title) {
			return {
				status: "error",
				message: "Step title required.",
			};
		}
		if (typeof step.title !== "string") {
			return {
				status: "error",
				message: "Invalid type of data for step title.",
			};
		}
		if (step.details && typeof step.details !== "string") {
			return {
				status: "error",
				message: "Invalid type of data for step details.",
			};
		}
		if (step.published && typeof step.published !== "boolean") {
			return {
				status: "error",
				message: "Invalid type of data for step published.",
			};
		}
	}

	// If all validations passed
	return { status: "success" };
};

const validateStepTitle = (stepTitle) => {
	//String type validation
	if (typeof stepTitle !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!stepTitle) {
		return { status: "error", message: "Step title required." };
	}
	// If all validations passed
	return { status: "success" };
};

module.exports = {
	validateSteps,
	validateStepTitle,
};
