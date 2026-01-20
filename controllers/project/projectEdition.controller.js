const { projectService, statusService, tagService, userRightsService, joinProjectService } = require("../../services");
const { apiResponse, projectValidation, filterTools, encryptTools, statusTools } = require("../../utils");

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

			// Check the user's permission depending on the section user wants to access
			const userPermissions = UserProjectRightsResult.projectRights.permissions;
			const hasPermissionToAccessSection = userPermissions[`canEdit${projectSectionEdition}`];
			if (!hasPermissionToAccessSection) {
				return apiResponse.serverErrorResponse(res, "User does not have permission to access this section of the project.");
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

			const projectFiltered = filterTools.filterProjectOutputFields(project, userId);
			if (projectFiltered.status !== "success") {
				return apiResponse.clientErrorResponse(res, projectFiltered.message);
			}

			// Build the base response
			const responseData = { project: projectFiltered.project, userPermissions };

			//Add specific data depending on the section
			// For the section General, retrieve all available tags for edition
			if (projectSectionEdition === "SectionGeneral") {
				const retrievedTags = await tagService.retrieveAllTags();
				if (retrievedTags.status !== "success") {
					return apiResponse.serverErrorResponse(res, retrievedTags.message);
				}

				// Add tagsList if successfully retrieved
				responseData.tagsList = retrievedTags.tags;
			}

			// For the section Status, retrieve all available statues for edition
			if (projectSectionEdition === "SectionStatus") {
				const retrievedStatuses = await statusService.retrieveAllStatuses("project", ["-_id", "status", "statusId", "description", "colors"]);
				if (retrievedStatuses.status !== "success") {
					return apiResponse.serverErrorResponse(res, retrievedStatuses.message);
				}

				// Depending on the current status string, return only the available statuses for update
				const allowedStatuses = statusTools.getAllowedStatuses(retrievedStatuses.statuses, project.statusInfo.currentStatus);
				responseData.statusesList = allowedStatuses;

				// Map current status to include correct statusId
				const currentStatus = responseData.project.statusInfo.currentStatus;
				const matchedStatus = retrievedStatuses.statuses.find((s) => s.status === currentStatus.status);
				if (matchedStatus) {
					responseData.project.statusInfo.currentStatus.statusId = matchedStatus.statusId;
				}
			}

			// For the section Steps, retrieve all available statues for edition
			if (projectSectionEdition === "SectionSteps") {
				const retrievedStatuses = await statusService.retrieveAllStatuses("projectStep", ["-_id", "status", "statusId", "description", "colors"]);
				if (retrievedStatuses.status !== "success") {
					return apiResponse.serverErrorResponse(res, retrievedStatuses.message);
				}

				responseData.statusesList = retrievedStatuses.statuses;
			}

			// For the section Members, retrieve joinProject requests and invitations
			if (projectSectionEdition === "SectionMembers") {
				responseData.joinProject = {};
				// Check the user's permission to see join project requests
				const hasPermissionToSeejoinRequests = userPermissions["canViewJoinProjectRequests"];
				if (hasPermissionToSeejoinRequests) {
					const joinProjectRequestsResult = await joinProjectService.retrieveProjectJoinProjects("join project request", project.projectId);
					if (joinProjectRequestsResult.status !== "success") {
						return apiResponse.serverErrorResponse(res, joinProjectRequestsResult.message);
					}

					// Add joinRequests and joinInvitations if successfully retrieved
					responseData.joinProject.joinRequests = joinProjectRequestsResult.joinProjects;
				}

				// Check the user's permission to see join project invitations
				const hasPermissionToSeejoinInvitations = userPermissions["canViewJoinProjectInvitations"];
				if (hasPermissionToSeejoinInvitations) {
					const joinProjectInvitationsResult = await joinProjectService.retrieveProjectJoinProjects("join project invitation", project.projectId);
					if (joinProjectInvitationsResult.status !== "success") {
						return apiResponse.serverErrorResponse(res, joinProjectInvitationsResult.message);
					}

					// Add joinInvitations if successfully retrieved
					responseData.joinProject.joinInvitations = joinProjectInvitationsResult.joinProjects;
				}
				if (Object.keys(responseData.joinProject).length === 0) {
					delete responseData.joinProject;
				}
			}

			// For the section Details, retrieve project owners
			if (projectSectionEdition === "SectionDetails") {
				responseData.project.owners = project.members.filter((member) => member.role === "owner");
				delete responseData.project.members;
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
const retrieveProjectStatus = retrieveProjectHandler("SectionStatus", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "startDate", "visibility"]);
const retrieveProjectLocation = retrieveProjectHandler("SectionLocation", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "location"]);
const retrieveProjectAttachments = retrieveProjectHandler("SectionAttachments", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "privateData"]);
const retrieveProjectSteps = retrieveProjectHandler("SectionSteps", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "steps"]);
const retrieveProjectQAs = retrieveProjectHandler("SectionQAs", ["-_id", "projectId", "title", "projectLink", "members", "statusInfo", "QAs"]);
const retrieveProjectDetails = retrieveProjectHandler("SectionDetails", ["-_id", "projectId", "title", "projectLink", "members", "createdAt", "createdBy", "updatedAt", "updatedBy", "likes", "crush"]);

const retrieveProjectRights = async (req, res) => {
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
		const hasPermission = UserProjectRightsResult.projectRights.permissions["canEditSectionRights"];
		if (!hasPermission) {
			return apiResponse.serverErrorResponse(res, "User does not have permission to update this section of the project.");
		}

		// Retrieve project data with requested fields
		const projectData = await projectService.retrieveProjectByLink(projectLink, ["-_id", "projectId", "title", "projectLink", "members"]);
		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}

		//Verify user is member of the project
		const project = projectData.project;
		const projectId = project.projectId;
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

		// Retieve all project members rights for this project
		const membersProjectRightsResult = await userRightsService.retrieveMembersProjectRights(projectId, projectMembers);
		if (membersProjectRightsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, membersProjectRightsResult.message);
		}

		//Filter members public data from users
		const users = membersProjectRightsResult.membersProjectRights.map((item) => item.user);

		const membersFiltered = filterTools.filterUsersOutputFields(users, "unknown");
		if (membersFiltered.status !== "success") {
			return apiResponse.serverErrorResponse(res, membersFiltered.message);
		}

		const filteredUsersMap = new Map(membersFiltered.users.map((user) => [user.userId, user]));

		// Recompose membersProjectRights
		const membersProjectRightsFiltered = membersProjectRightsResult.membersProjectRights.map((item) => ({
			...item,
			user: filteredUsersMap.get(item.user.userId) ?? item.user,
		}));

		const enrichedMembers = membersProjectRightsFiltered.map((memberRights) => {
			const correspondingMember = projectMembers.find((m) => m.user.userId === memberRights.user.userId);
			return {
				...memberRights,
				role: correspondingMember?.role || null,
			};
		});

		// Build the base response
		const responseData = { projectId: projectId, membersProjectRights: enrichedMembers, userPermissions: UserProjectRightsResult.projectRights.permissions };

		// Return the final success response
		return apiResponse.successResponseWithData(res, projectData.message, responseData);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

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
