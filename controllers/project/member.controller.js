const { userRightsService, memberService } = require("../../services");
const { apiResponse, memberValidation } = require("../../utils");

const updateProjectMember = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;
		const { memberId = "", newRole = "", newStartDate = "", newTalent = "" } = req.body;

		// Validate input data for updating a project member
		const validationResult = memberValidation.validateMemberInputs(userIdUpdater, projectId, memberId, newRole, newStartDate, newTalent);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditMembers permission
		if (!rightsCheckResult.projectRights.permissions.canEditMembers) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update members for this project.");
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

		// In case of update of member's start date
		if (newStartDate) {
			const updateStartDateResult = await memberService.updateMemberstartDate(projectId, memberId, newStartDate);
			if (updateStartDateResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, updateStartDateResult.message);
			}
		}

		// In case of update of member's talent
		if (newTalent) {
			const updateTalentResult = await memberService.updateMemberTalent(projectId, memberId, newTalent);
			if (updateTalentResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, updateTalentResult.message);
			}
		}

		return apiResponse.successResponse(res, "Member updated successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeProjectMember = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;
		const { memberId = "" } = req.body;

		// Validate input data for removing a project member
		const validationResult = memberValidation.validateMemberInputs(userIdUpdater, projectId, memberId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canRemoveMembers permission
		if (!rightsCheckResult.projectRights.permissions.canRemoveMembers) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to remove members for this project.");
		}

		// Remove the member from the project
		const removeMemberResult = await memberService.updateMemberFromProject(projectId, memberId, "remove");
		if (removeMemberResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeMemberResult.message);
		}

		// Remove the user's rights for the project
		const removeUserRightsResult = await userRightsService.removeUserProjectRights(projectId, memberId);
		if (removeUserRightsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeUserRightsResult.message);
		}

		return apiResponse.successResponse(res, "Member removed from the project successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	updateProjectMember,
	removeProjectMember,
};
