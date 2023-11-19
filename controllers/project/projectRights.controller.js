const { userRightsService, projectService } = require("../../services");
const { apiResponse, ProjectRightsValidation, encryptTools } = require("../../utils");

/**
 * Edit user's right to update a project controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created category or an error message.
 */
const updateUserProjectRights = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { updatedPermissions, userIdUpdated } = req.body;
		const { projectId } = req.params;

		// Validate input data for updating user's right
		const validationResult = ProjectRightsValidation.validateUserProjectRightsInputs(userIdUpdater, userIdUpdated, projectId, updatedPermissions);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditRights permission
		if (!rightsCheckResult.projectRights.permissions.canEditRights) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update project rights.");
		}

		//Check if the user to be updated is owner of the project
		const ProjectMembersResult = await projectService.retrieveProjectById(projectId, "members");

		if (ProjectMembersResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, ProjectMembersResult.message);
		}

		const projectMembers = ProjectMembersResult.project.members;

		// Convert id to ObjectId
		const objectIdUserIdUpdated = encryptTools.convertIdToObjectId(userIdUpdated);
		if (objectIdUserIdUpdated.status == "error") {
			return apiResponse.serverErrorResponse(res, objectIdUserIdUpdated.message);
		}

		// Find the user to be updated in the project's members
		const userToBeUpdated = projectMembers.find((member) => member.user.toString() === objectIdUserIdUpdated.toString());

		if (!userToBeUpdated) {
			// If user to be updated is not member of the project, return error
			return apiResponse.unauthorizedResponse(res, "Member not found for this project.");
		}

		if (userToBeUpdated.role === "owner") {
			// If user to be updated is the owner of the project, its rights cannot be updated
			return apiResponse.unauthorizedResponse(res, "The owner of the project cannot have its rights updated.");
		}

		// Update the user's project rights
		const updateResult = await userRightsService.updateUserProjectRights(projectId, userIdUpdated, updatedPermissions, userIdUpdater);
		if (updateResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateResult.message);
		}
		return apiResponse.successResponse(res, updateResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(
			res,

			error.message
		);
	}
};

module.exports = {
	updateUserProjectRights,
};
