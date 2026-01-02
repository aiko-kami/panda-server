const { userRightsService, projectStepQAService } = require("../../services");
const { apiResponse, idsValidation, stringValidation } = require("../../utils");

/**
 * Update project steps controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated project or an error message.
 */
const addSteps = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", steps } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for creating project steps
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const stepValidationResult = stringValidation.validateSteps(steps);
		if (stepValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, stepValidationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditSteps permission
		if (!rightsCheckResult.projectRights.permissions.canEditSteps) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update steps for this project.");
		}

		const stepResult = await projectStepQAService.editSteps(projectId, userId, steps, "create");
		if (stepResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, stepResult.message);
		}

		return apiResponse.successResponseWithData(res, stepResult.message, stepResult.stepsOutput);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateSteps = async (req, res) => {
	try {
		const userId = req.userId;
		const { projectId = "", steps } = req.body;
		const ids = {
			userId,
			projectId,
		};

		// Validate input data for updating project steps
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const stepValidationResult = stringValidation.validateSteps(steps);
		if (stepValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, stepValidationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditSteps permission
		if (!rightsCheckResult.projectRights.permissions.canEditSteps) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update steps for this project.");
		}

		const stepResult = await projectStepQAService.editSteps(projectId, userId, steps, "update");
		if (stepResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, stepResult.message);
		}

		return apiResponse.successResponse(res, stepResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const publishStep = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", stepTitle = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for updating project step
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const stepValidationResult = stringValidation.validateStepTitle(stepTitle);
		if (stepValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, stepValidationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditSteps permission
		if (!rightsCheckResult.projectRights.permissions.canEditSteps) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update steps for this project.");
		}

		const stepResult = await projectStepQAService.editSteps(projectId, userId, stepTitle, "publish");
		if (stepResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, stepResult.message);
		}

		return apiResponse.successResponse(res, stepResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const unpublishStep = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", stepTitle = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for updating project step
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const stepValidationResult = stringValidation.validateStepTitle(stepTitle);
		if (stepValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, stepValidationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditSteps permission
		if (!rightsCheckResult.projectRights.permissions.canEditSteps) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update steps for this project.");
		}

		const stepResult = await projectStepQAService.editSteps(projectId, userId, stepTitle, "unpublish");
		if (stepResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, stepResult.message);
		}

		return apiResponse.successResponse(res, stepResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeStep = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", stepTitle = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for removing project step
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const stepValidationResult = stringValidation.validateStepTitle(stepTitle);
		if (stepValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, stepValidationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditSteps permission
		if (!rightsCheckResult.projectRights.permissions.canEditSteps) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update steps for this project.");
		}

		const stepResult = await projectStepQAService.editSteps(projectId, userId, stepTitle, "remove");
		if (stepResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, stepResult.message);
		}

		return apiResponse.successResponse(res, stepResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive for one project the project steps that are published
const retrieveProjectStepsPublished = async (req, res) => {
	try {
		const { projectId = "" } = req.body;

		// Validate input data for updating project like
		const validationResult = idsValidation.validateIdInput(projectId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const stepResult = await projectStepQAService.retrieveProjectSteps(projectId, "published");

		if (stepResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, stepResult.message);
		}
		return apiResponse.successResponseWithData(res, stepResult.message, stepResult.stepsOutput);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive for one project all the project steps
const retrieveProjectStepsAll = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for removing project step
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditSteps permission
		if (!rightsCheckResult.projectRights.permissions.canEditSteps) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update steps for this project.");
		}

		const stepResult = await projectStepQAService.retrieveProjectSteps(projectId, "all", userId);
		if (stepResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, stepResult.message);
		}
		return apiResponse.successResponseWithData(res, stepResult.message, stepResult.stepsOutput);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	addSteps,
	updateSteps,
	publishStep,
	unpublishStep,
	removeStep,
	retrieveProjectStepsPublished,
	retrieveProjectStepsAll,
};
