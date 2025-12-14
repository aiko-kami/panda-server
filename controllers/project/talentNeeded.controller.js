const { userRightsService, memberService } = require("../../services");
const { apiResponse, memberValidation } = require("../../utils");

const addTalentNeeded = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;

		const updatedTalentNeededInputs = {
			talent: req.body.talent ?? "",
			description: req.body.description ?? "",
		};

		// Validate input data for updating a talent needed
		const validationResult = memberValidation.validateTalentNeededInputs(userIdUpdater, projectId, updatedTalentNeededInputs.talent, updatedTalentNeededInputs.description);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditTalentsNeeded permission
		if (!rightsCheckResult.projectRights.permissions.canEditTalentsNeeded) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update talents needed for this project.");
		}

		// Add the new talent needed to the project
		const updateTalentNeededResult = await memberService.updateTalentNeeded(projectId, userIdUpdater, updatedTalentNeededInputs, "add");
		if (updateTalentNeededResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateTalentNeededResult.message);
		}

		return apiResponse.successResponse(res, "Talent needed added successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeTalentNeeded = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;

		const talentToRemove = {
			talent: req.body.talent ?? "",
			description: "",
		};

		// Validate input data for removing a talent needed
		const validationResult = memberValidation.validateTalentNeededRemoveInputs(userIdUpdater, projectId, talentToRemove.talent);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditTalentsNeeded permission
		if (!rightsCheckResult.projectRights.permissions.canEditTalentsNeeded) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update talents needed for this project.");
		}

		// Remove the talent needed from the project
		const removeTalentNeededResult = await memberService.updateTalentNeeded(projectId, userIdUpdater, talentToRemove, "remove");
		if (removeTalentNeededResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeTalentNeededResult.message);
		}

		return apiResponse.successResponse(res, removeTalentNeededResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	addTalentNeeded,
	removeTalentNeeded,
};
