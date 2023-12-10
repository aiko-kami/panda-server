const validateSteps = (steps) => {
	//String type validation
	if (!Array.isArray(steps) || steps.length === 0) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Check every element
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

const validateQAs = (QAs) => {
	//String type validation
	if (!Array.isArray(QAs) || QAs.length === 0) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Check every element
	for (const QA of QAs) {
		if (!QA.question) {
			return {
				status: "error",
				message: "Q&A question required.",
			};
		}
		if (typeof QA.question !== "string") {
			return {
				status: "error",
				message: "Invalid type of data for Q&A question.",
			};
		}
		if (QA.response && typeof QA.response !== "string") {
			return {
				status: "error",
				message: "Invalid type of data for Q&A response.",
			};
		}
		if (QA.published && typeof QA.published !== "boolean") {
			return {
				status: "error",
				message: "Invalid type of data for Q&A published.",
			};
		}
	}
	// If all validations passed
	return { status: "success" };
};

const validateQAQuestion = (QAQuestion) => {
	//String type validation
	if (typeof QAQuestion !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!QAQuestion) {
		return { status: "error", message: "Q&A question required." };
	}
	// If all validations passed
	return { status: "success" };
};

module.exports = {
	validateSteps,
	validateStepTitle,
	validateQAs,
	validateQAQuestion,
};
