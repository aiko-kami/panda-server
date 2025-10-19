const { projectService, tagService } = require("../../services");
const { apiResponse, projectValidation, encryptTools } = require("../../utils");

const retrieveProjectHandler = (requestedFields = []) => {
	return async (req, res) => {
		try {
			const { projectLink = "" } = req.params;
			const userId = req.userId;

			// Validate input data
			const validationResult = projectValidation.validateProjectLinkAndUserId(projectLink, userId, "mandatory");
			if (validationResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationResult.message);
			}

			// Retrieve project data with requested fields
			const projectData = await projectService.retrieveProjectByLink(projectLink, requestedFields);
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

			let retrievedTags = null;
			// If the project tags are to part of the edit, retrieve all available tags for edition
			if (requestedFields.includes("tags")) {
				// Call the service to retrieve the tags
				retrievedTags = await tagService.retrieveAllTags();
				if (retrievedTags.status !== "success") {
					return apiResponse.serverErrorResponse(res, retrievedTags.message);
				}
			}

			return apiResponse.successResponseWithData(res, projectData.message, { project, tagsList: retrievedTags.tags });
		} catch (error) {
			return apiResponse.serverErrorResponse(res, error.message);
		}
	};
};

const retrieveProjectGeneral = retrieveProjectHandler([
	"-_id",
	"projectId",
	"title",
	"projectLink",
	"members",
	"statusInfo",
	"category",
	"subCategory",
	"goal",
	"summary",
	"description",
	"cover",
	"tags",
	"creatorMotivation",
	"objectives",
]);
const retrieveProjectStatus = retrieveProjectHandler(["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "startDate", "visibility"]);
const retrieveProjectLocation = retrieveProjectHandler(["-_id", "projectLink", "title", "projectLink", "members", "statusInfo", "location"]);

module.exports = {
	retrieveProjectGeneral,
	retrieveProjectLocation,
	retrieveProjectStatus,
};
