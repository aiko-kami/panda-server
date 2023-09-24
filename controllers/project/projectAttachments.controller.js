const { projectService, categoryService, userService, userRightsService } = require("../../services");
const { apiResponse, projectValidation, projectTools } = require("../../utils");

/**
 * Update project attachments.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated attachments or an error message.
 */
const updateProjectAttachments = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;
		const { newStatus = "" } = req.body;

		// Validate input data for updating a project member
		const validationResult = memberValidation.validateMemberInputs(userIdUpdater, projectId, newStatus);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditAttachments permission
		if (!rightsCheckResult.projectRights.permissions.canEditAttachments) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update attachments for this project.");
		}

		// In case of update of member's role
		if (newRole) {
			const updateRoleResult = await memberService.updateMemberRole(projectId, memberId, newRole);
			if (updateRoleResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, updateRoleResult.message);
			}

			// Update users's project rights
			// If new role is "owner" ==> Set owner rights
			if (newRole === "owner") {
				const setRightsResult = await userRightsService.updateUserProjectRights(projectId, memberId, "owner", userIdUpdater);
				if (setRightsResult.status !== "success") {
					return apiResponse.serverErrorResponse(res, setRightsResult.message);
				}
			}

			// If new role is "member" ==> Set member rights
			else if (newRole === "member") {
				const setRightsResult = await userRightsService.updateUserProjectRights(projectId, memberId, "member", userIdUpdater);
				if (setRightsResult.status !== "success") {
					return apiResponse.serverErrorResponse(res, setRightsResult.message);
				}
			}
		}

		return apiResponse.successResponse(res, "Attachment updated successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	updateProjectAttachments,
};
