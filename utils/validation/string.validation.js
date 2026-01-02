const config = require("../../config");
const projectStepStatus = config.project_step_status;

const validateStep = (step) => {
	// Check that step is a non-null object
	if (typeof step !== "object" || step === null) {
		return { status: "error", message: "Step must be an object." };
	}
	if (!step.title) {
		return {
			status: "error",
			message: "Step title is required.",
		};
	}
	if (typeof step.title !== "string") {
		return {
			status: "error",
			message: "Invalid type of data for step title.",
		};
	}
	if (!step.details) {
		return {
			status: "error",
			message: "Step details is required.",
		};
	}
	if (typeof step.details !== "string") {
		return {
			status: "error",
			message: "Invalid type of data for step details.",
		};
	}
	if (typeof step.published !== "boolean") {
		return {
			status: "error",
			message: "Invalid type of data for step published.",
		};
	}
	if (!step.statusId) {
		return {
			status: "error",
			message: "Step status ID is required.",
		};
	}
	if (typeof step.statusId !== "string") {
		return {
			status: "error",
			message: "Invalid type of data for step status ID.",
		};
	}
	// If all validations passed
	return { status: "success" };
};

const validateSteps = (steps) => {
	//Non-empty array validation
	if (!Array.isArray(steps) || steps.length === 0) {
		return { status: "error", message: "Steps must be a non-empty array." };
	}
	// Validate each step individually
	for (const step of steps) {
		const result = validateStep(step);
		if (result.status !== "success") {
			return result; // return the first error found
		}
	}
	// If all validations passed
	return { status: "success" };
};

const validateStepTitle = (stepTitle) => {
	//String type validation
	if (!stepTitle) {
		return { status: "error", message: "Step title is required." };
	}
	if (typeof stepTitle !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	// If all validations passed
	return { status: "success" };
};

const validateQAs = (QAs) => {
	//String type validation
	if (!Array.isArray(QAs) || !QAs((qa) => typeof qa === "string") || QAs.length === 0) {
		return { status: "error", message: "Invalid type of data." };
	}
	// Check every element
	for (const QA of QAs) {
		if (typeof QA.question !== "string" || QA.question.trim() === "") {
			return {
				status: "error",
				message: "Q&A question is required and must be a non-empty string.",
			};
		}
		if (QA.response !== undefined && typeof QA.response !== "string") {
			return {
				status: "error",
				message: "Invalid type of data for Q&A response.",
			};
		}
		if (QA.published !== undefined && typeof QA.published !== "boolean") {
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
	if (!QAQuestion) {
		return { status: "error", message: "Q&A question is required." };
	}
	if (typeof QAQuestion !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	// If all validations passed
	return { status: "success" };
};

const validateComment = (commentContent) => {
	//String type validation
	if (!commentContent) {
		return { status: "error", message: "Comment content is required." };
	}
	if (typeof commentContent !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	// If all validations passed
	return { status: "success" };
};

module.exports = {
	validateStep,
	validateSteps,
	validateStepTitle,
	validateQAs,
	validateQAQuestion,
	validateComment,
};
