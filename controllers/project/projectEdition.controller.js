const { projectService, tagService, userRightsService } = require("../../services");
const { apiResponse, projectValidation, encryptTools } = require("../../utils");

const retrieveProjectHandler = (projectSectionEdition, requestedFields = []) => {
	return async (req, res) => {
		try {
			const { projectLink = "" } = req.params;
			const userId = req.userId;

			// Validate input data
			const validationResult = projectValidation.validateProjectLinkAndUserId(projectLink, userId, "mandatory");
			if (validationResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationResult.message);
			}

			//Verify user's project rights
			const UserProjectRightsResult = await userRightsService.retrieveProjectRightsByLink(projectLink, userId);
			if (UserProjectRightsResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, UserProjectRightsResult.message);
			}

			// Check the user's permission dynamically
			const hasPermission = UserProjectRightsResult.projectRights.permissions[`canEdit${projectSectionEdition}`];
			if (!hasPermission) {
				return apiResponse.serverErrorResponse(res, "User does not have permission to update this section of the project.");
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

			// Build the base response
			const responseData = { project };

			// If the project tags are part of the edit, retrieve all available tags for edition
			if (requestedFields.includes("tags")) {
				const retrievedTags = await tagService.retrieveAllTags();
				if (retrievedTags.status !== "success") {
					return apiResponse.serverErrorResponse(res, retrievedTags.message);
				}

				// Only add tagsList if successfully retrieved
				responseData.tagsList = retrievedTags.tags;
			}

			// Return the final success response
			return apiResponse.successResponseWithData(res, projectData.message, responseData);
		} catch (error) {
			return apiResponse.serverErrorResponse(res, error.message);
		}
	};
};

const retrieveProjectGeneral = retrieveProjectHandler("SectionGeneral", [
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
const retrieveProjectMembers = retrieveProjectHandler("SectionMembers", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "talentsNeeded"]);
const retrieveProjectRights = retrieveProjectHandler("SectionRights", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "startDate", "visibility"]);
const retrieveProjectStatus = retrieveProjectHandler("SectionStatus", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "startDate", "visibility"]);
const retrieveProjectLocation = retrieveProjectHandler("SectionLocation", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "location"]);
const retrieveProjectAttachments = retrieveProjectHandler("SectionAttachments", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "privateData"]);
const retrieveProjectSteps = retrieveProjectHandler("SectionSteps", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "steps"]);
const retrieveProjectQAs = retrieveProjectHandler("SectionQAs", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "QAs"]);
const retrieveProjectDetails = retrieveProjectHandler("SectionDetails", [
	"-_id",
	"projectId",
	"title",
	"projectLink",
	"members",
	"statusInfo",
	"createdAt",
	"updatedAt",
	"updatedBy",
	"likes",
	"crush",
]);

module.exports = {
	retrieveProjectGeneral,
	retrieveProjectMembers,
	retrieveProjectRights,
	retrieveProjectStatus,
	retrieveProjectLocation,
	retrieveProjectAttachments,
	retrieveProjectSteps,
	retrieveProjectQAs,
	retrieveProjectDetails,
};
