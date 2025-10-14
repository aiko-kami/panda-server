const { projectService, categoryService, userService, userRightsService, statusService, adminService, emailService } = require("../../services");
const { apiResponse, projectValidation, filterTools, encryptTools, idsValidation } = require("../../utils");

const retrieveProjectLocation = async (req, res) => {
	try {
		const { projectId = "" } = req.params;

		const userId = req.userId;

		// Validate input data
		const validationResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		//Retrieve project data
		const projectData = await projectService.retrieveProjectById(projectId, ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "location"]);
		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}

		//Verify user is member of the project
		const projectMembers = projectData.project.members;

		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return apiResponse.serverErrorResponse(res, objectIdUserId.message);
		}

		// Find the user in the project's members
		const isUserProjectMember = projectMembers.find((member) => encryptTools.convertIdToObjectId(member.user.userId).toString() === objectIdUserId.toString());

		// If user is not member of the project, return error
		if (!isUserProjectMember) {
			return apiResponse.unauthorizedResponse(res, "Data only available for the members of the project.");
		}

		return apiResponse.successResponseWithData(res, projectData.message, { project: projectData.project });
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	retrieveProjectLocation,
};
