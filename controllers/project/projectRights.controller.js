const { userRightsService, projectService } = require("../../services");
const { apiResponse, projectRightsValidation, projectValidation, encryptTools } = require("../../utils");

/**
 * Edit user's right to update a project controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created category or an error message.
 */
const updateUserProjectRights = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId } = req.params;

		const member = {
			userId: req.body.userIdUpdated ?? "",
			permissions: req.body.updatedPermissions ?? {},
		};

		// Validate input data for updating user's right
		const validationIdsResult = projectRightsValidation.validateUserProjectRightsIds(userIdUpdater, projectId);
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		const validationInputsResult = projectRightsValidation.validateUserProjectRightsInputs(member);
		if (validationInputsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationInputsResult.message);
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

		// Retrieve Project Members
		const ProjectMembersResult = await projectService.retrieveProjectById(projectId, ["members"]);
		if (ProjectMembersResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, ProjectMembersResult.message);
		}

		const projectMembers = ProjectMembersResult.project.members;

		// Convert id to ObjectId
		const objectIdUserIdUpdated = encryptTools.convertIdToObjectId(member.userIdUpdated);
		if (objectIdUserIdUpdated.status == "error") {
			return apiResponse.serverErrorResponse(res, objectIdUserIdUpdated.message);
		}

		// Find the user to be updated in the project's members
		const userToBeUpdated = projectMembers.find((projectMember) => projectMember.user.toString() === objectIdUserIdUpdated.toString());
		if (!userToBeUpdated) {
			// If user to be updated is not member of the project, return error
			return apiResponse.serverErrorResponse(res, "Member not found for this project.");
		}
		if (userToBeUpdated.role === "owner") {
			// If user to be updated is the owner of the project, its rights cannot be updated
			return apiResponse.unauthorizedResponse(res, "The owner of the project cannot have its rights updated.");
		}

		// Update the user's project rights
		const updateResult = await userRightsService.updateUserProjectRights(projectId, member, userIdUpdater);
		if (updateResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateResult.message);
		}

		return apiResponse.successResponse(res, updateResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(
			res,

			error.message,
		);
	}
};

const updateUsersProjectRights = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId } = req.params;
		const { members } = req.body;

		// Validate input data for updating user's right
		const validationIdsResult = projectRightsValidation.validateUserProjectRightsIds(userIdUpdater, projectId);
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		const validationInputsResult = projectRightsValidation.validateUsersProjectRightsInputs(members);
		if (validationInputsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationInputsResult.message);
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

		//Retrieve Project Members
		const ProjectMembersResult = await projectService.retrieveProjectById(projectId, ["members"]);
		if (ProjectMembersResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, ProjectMembersResult.message);
		}

		const projectMembers = ProjectMembersResult.project.members;

		// Loop through members to update
		for (const member of members) {
			// Convert id to ObjectId
			const objectIdUserIdUpdated = encryptTools.convertIdToObjectId(member.userId);
			if (objectIdUserIdUpdated.status == "error") {
				return apiResponse.serverErrorResponse(res, objectIdUserIdUpdated.message);
			}

			// Find the user to be updated in the project's members
			const userToBeUpdated = projectMembers.find((projectMember) => projectMember.user._id.toString() === objectIdUserIdUpdated.toString());
			if (!userToBeUpdated) {
				// If user to be updated is not member of the project, return error
				return apiResponse.serverErrorResponse(res, "Member not found for this project.");
			}

			if (userToBeUpdated.role === "owner") {
				// If user to be updated is the owner of the project, its rights cannot be updated - this member is skipped
				continue;
			}

			// Update the user's project rights
			const updateResult = await userRightsService.updateUserProjectRights(projectId, member, userIdUpdater);
			if (updateResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, updateResult.message);
			}
		}
		return apiResponse.successResponse(res, "Project rights updated successfully");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveUserProjectRights = async (req, res) => {
	try {
		const userId = req.userId;
		const { projectLink = "" } = req.params;

		// Validate Ids for retrieving user project rights
		const validationResult = projectValidation.validateProjectLinkAndUserId(projectLink, userId, "mandatory");
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve project data with requested fields
		const projectData = await projectService.retrieveProjectByLink(projectLink, ["-_id", "projectId", "members"]);
		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}

		//Verify user is member of the project
		const project = projectData.project;
		const projectMembers = project?.members || [];

		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId && objectIdUserId.status === "error") {
			return apiResponse.serverErrorResponse(res, objectIdUserId.message);
		}

		// Find the user in the project's members
		const isUserProjectMember = projectMembers.find((member) => encryptTools.convertIdToObjectId(member.user.userId).toString() === objectIdUserId.toString());

		// If user is not member of the project, return error

		if (!isUserProjectMember) {
			return apiResponse.unauthorizedResponse(res, "Data only available for the members of the project.");
		}

		// Retrieve Project Rights of the updater
		const UserProjectRightsResult = await userRightsService.retrieveProjectRightsByLink(projectLink, userId);
		if (UserProjectRightsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, UserProjectRightsResult.message);
		}

		return apiResponse.successResponseWithData(res, UserProjectRightsResult.message, {
			projectRights: UserProjectRightsResult.projectRights,
			projectStatus: UserProjectRightsResult.projectStatus,
		});
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	updateUserProjectRights,
	updateUsersProjectRights,
	retrieveUserProjectRights,
};
