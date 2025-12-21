const { userRightsService, projectService } = require("../../services");
const { apiResponse, projectValidation } = require("../../utils");

const addObjective = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;

		const updatedObjectiveInputs = {
			objective: req.body.objective ?? "",
		};

		// Validate input data for updating an objective
		const validationResult = projectValidation.validateObjectiveInputs(userIdUpdater, projectId, updatedObjectiveInputs.objective);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditObjectives permission
		if (!rightsCheckResult.projectRights.permissions.canEditObjectives) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update objectives for this project.");
		}

		// Add the objective to the project
		const updateObjectiveResult = await projectService.updateObjective(projectId, userIdUpdater, updatedObjectiveInputs.objective, "add");
		if (updateObjectiveResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateObjectiveResult.message);
		}

		return apiResponse.successResponse(res, "Objective added successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeObjective = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;

		const objectiveToRemove = {
			objective: req.body.objective ?? "",
		};

		// Validate input data for removing an objective
		const validationResult = projectValidation.validateObjectiveInputs(userIdUpdater, projectId, objectiveToRemove.objective);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditObjectives permission
		if (!rightsCheckResult.projectRights.permissions.canEditObjectives) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update objectives for this project.");
		}

		// Remove the objective from the project
		const removeObjectiveResult = await projectService.updateObjective(projectId, userIdUpdater, objectiveToRemove.objective, "remove");
		if (removeObjectiveResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeObjectiveResult.message);
		}

		return apiResponse.successResponse(res, removeObjectiveResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	addObjective,
	removeObjective,
};
