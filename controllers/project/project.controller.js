const { projectService, categoryService, userService, userRightsService, statusService, adminService, emailService } = require("../../services");
const { apiResponse, projectValidation, filterTools, encryptTools, idsValidation } = require("../../utils");

/**
 * Create new project draft controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created project or an error message.
 */
const createProjectDraft = async (req, res) => {
	try {
		const userId = req.userId;
		//Retrieve and initialize project data
		const projectData = {
			title: req.body.projectInputs.title || "",
			goal: req.body.projectInputs.goal || "",
			summary: req.body.projectInputs.summary || "",
			description: req.body.projectInputs.description || "",
			cover: req.body.projectInputs.cover || "",
			categoryId: req.body.projectInputs.categoryId || "",
			subCategory: req.body.projectInputs.subCategory || "",
			locationCountry: req.body.projectInputs.locationCountry || "",
			locationCity: req.body.projectInputs.locationCity || "",
			locationOnlineOnly: Boolean(req.body.projectInputs.locationOnlineOnly) || false,
			startDate: req.body.projectInputs.startDate || "",
			creatorMotivation: req.body.projectInputs.creatorMotivation || "",
			visibility: req.body.projectInputs.visibility || "public",
			tags: req.body.projectInputs.tags || [],
			talentsNeeded: req.body.projectInputs.talentsNeeded || [],
			objectives: req.body.projectInputs.objectives || [],
			status: "draft",
			statusReason: "project creation",
		};

		// Validate input data for creating a project
		const validationResult = projectValidation.validateDraftProjectInputs(projectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		//Verify that user (project creator) exists in the database
		const existingCreator = await userService.retrieveUserById(userId, ["-_id"]);
		if (existingCreator.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingCreator.message);
		}

		// Verify that category and sub-category (if sub-category provided) exist in the database
		const categoryVerified = await categoryService.verifyCategoryAndSubCategoryExist(projectData.categoryId, projectData.subCategory);
		if (categoryVerified.status !== "success") {
			return apiResponse.clientErrorResponse(res, categoryVerified.message);
		}

		projectData.creatorId = userId;

		// Create the project
		const createResult = await projectService.createProject(projectData);
		if (createResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, createResult.message);
		}

		return apiResponse.successResponseWithData(res, createResult.message, createResult.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

/**
 * Update a project for which status is draft controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created project or an error message.
 */
const updateProjectDraft = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;
		//Retrieve and initialize project data
		const projectDataToUpdate = {
			title: req.body.projectInputs.title || "",
			goal: req.body.projectInputs.goal || "",
			summary: req.body.projectInputs.summary || "",
			description: req.body.projectInputs.description || "",
			cover: req.body.projectInputs.cover || "",
			categoryId: req.body.projectInputs.categoryId || "",
			subCategory: req.body.projectInputs.subCategory || "",
			locationCountry: req.body.projectInputs.locationCountry || "",
			locationCity: req.body.projectInputs.locationCity || "",
			locationOnlineOnly: Boolean(req.body.projectInputs.locationOnlineOnly) || false,
			startDate: req.body.projectInputs.startDate || "",
			creatorMotivation: req.body.projectInputs.creatorMotivation || "",
			visibility: req.body.projectInputs.visibility || "public",
			tags: req.body.projectInputs.tags || [],
			talentsNeeded: req.body.projectInputs.talentsNeeded || [],
			objectives: req.body.projectInputs.objectives || [],
		};

		// Validate input data for updating a project
		const validationResult = projectValidation.validateDraftProjectInputs(projectDataToUpdate);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Validate Ids for updating a project
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		//Verify that user (project creator) exists in the database
		const existingCreator = await userService.retrieveUserById(userId, ["-_id"]);
		if (existingCreator.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingCreator.message);
		}

		// Verify that category and sub-category (if sub-category provided) exist in the database
		const categoryVerified = await categoryService.verifyCategoryAndSubCategoryExist(projectDataToUpdate.categoryId, projectDataToUpdate.subCategory);
		if (categoryVerified.status !== "success") {
			return apiResponse.clientErrorResponse(res, categoryVerified.message);
		}

		// Filter on the fields that the user wants to update
		const filterProjectInputs = filterTools.filterProjectFieldsToUpdate(projectDataToUpdate);

		// Update the project
		const updatedResult = await projectService.updateProjectDraft(projectId, filterProjectInputs, userId);
		if (updatedResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedResult.message);
		}

		return apiResponse.successResponseWithData(res, updatedResult.message, updatedResult.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeProjectDraft = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;

		// Validate Ids for updating a project
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		//Verify that user (project creator) exists in the database
		const existingCreator = await userService.retrieveUserById(userId, ["-_id"]);
		if (existingCreator.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingCreator.message);
		}

		// Remove the project
		const removeResult = await projectService.removeProjectDraft(projectId, userId);
		if (removeResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeResult.message);
		}

		return apiResponse.successResponseWithData(res, removeResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const submitProject = async (req, res) => {
	try {
		const projectId = req.body.projectInputs.projectId || "";
		const userId = req.userId;
		//Retrieve and initialize project data
		const projectData = {
			title: req.body.projectInputs.title || "",
			goal: req.body.projectInputs.goal || "",
			summary: req.body.projectInputs.summary || "",
			description: req.body.projectInputs.description || "",
			cover: req.body.projectInputs.cover || "",
			categoryId: req.body.projectInputs.categoryId || "",
			subCategory: req.body.projectInputs.subCategory || "",
			locationCountry: req.body.projectInputs.locationCountry || "",
			locationCity: req.body.projectInputs.locationCity || "",
			locationOnlineOnly: Boolean(req.body.projectInputs.locationOnlineOnly) || false,
			startDate: req.body.projectInputs.startDate || "",
			creatorMotivation: req.body.projectInputs.creatorMotivation || "",
			visibility: req.body.projectInputs.visibility || "public",
			tags: req.body.projectInputs.tags || [],
			talentsNeeded: req.body.projectInputs.talentsNeeded || [],
			objectives: req.body.projectInputs.objectives || [],
		};

		// Validate input data for updating a project
		const validationResult = projectValidation.validateSubmittedProjectInputs(projectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Validate Ids for updating a project
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "optional");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		//Verify that user (project creator) exists in the database
		const existingCreator = await userService.retrieveUserById(userId, ["-_id"]);
		if (existingCreator.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingCreator.message);
		}

		// Verify that category and sub-category (if sub-category provided) exist in the database
		const categoryVerified = await categoryService.verifyCategoryAndSubCategoryExist(projectData.categoryId, projectData.subCategory);
		if (categoryVerified.status !== "success") {
			return apiResponse.clientErrorResponse(res, categoryVerified.message);
		}

		projectData.creatorId = userId;

		let projectUpdatedResult;
		if (!projectId) {
			projectData.status = "draft";
			projectData.statusReason = "Project creation before submission";
			// Create the project and set project status to submitted
			projectUpdatedResult = await projectService.createProject(projectData, userId);
			if (projectUpdatedResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, projectUpdatedResult.message);
			}
		} else if (projectId) {
			// Filter on the fields that the user wants to update
			const filterProjectInputs = filterTools.filterProjectFieldsToUpdate(projectData);

			// Update the project
			projectUpdatedResult = await projectService.updateProjectDraft(projectId, filterProjectInputs, userId);
			if (projectUpdatedResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, projectUpdatedResult.message);
			}
		}

		// Set project status to Submitted
		const projectSubmittedResult = await statusService.updateStatus(projectUpdatedResult.project.projectId, userId, "submitted", "Project creation and submission");

		if (projectSubmittedResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectSubmittedResult.message);
		}

		const username = projectSubmittedResult.project.members[0].user.username;
		const usernameCapitalized = username.charAt(0).toUpperCase() + username.slice(1);
		const emailTitle = "[Sheepy - Admin] New Project Submitted - Approval Required";

		// Send email notification to admin that new project has been submitted
		const emailInputs = {
			adminEmail: process.env.ADMIN_EMAIL,
			projectId: projectSubmittedResult.project.projectId,
			projectTitle: projectSubmittedResult.project.title,
			category: projectSubmittedResult.project.category.name,
			subCategory: projectSubmittedResult.project.subCategory,
			usernameCapitalized,
			submissionDateTime: projectSubmittedResult.project.createdAt.toString(),
			projectSummary: projectSubmittedResult.project.summary,
			emailTitle,
		};

		const projectSubmittedEmailSent = await emailService.sendProjectSubmissionEmail(emailInputs);
		if (projectSubmittedEmailSent.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectSubmittedEmailSent.message);
		}

		return apiResponse.successResponseWithData(res, "Project submitted successfully.", projectSubmittedResult.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const processProjectApproval = async (req, res) => {
	try {
		const projectId = req.body.projectApprovalInputs.projectId || "";
		const adminUserId = req.userId;

		const projectApproval = {
			approval: req.body.projectApprovalInputs.approval || "",
			reason: req.body.projectApprovalInputs.reason || "",
		};

		// Validate input data for updating a project
		const validationResult = projectValidation.validateProjectApproval(projectApproval);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Validate Ids for updating a project
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, adminUserId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		//Verify that user admin exists in the database
		const existingAdmin = await adminService.retrieveUserById(adminUserId, ["-_id"]);
		if (existingAdmin.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingAdmin.message);
		}

		// Update the project
		//adminUserId is useless today (who did the update is not logged in the DB)
		const approvalResult = await projectService.processProjectApproval(projectId, projectApproval, adminUserId);
		if (approvalResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, approvalResult.message);
		}

		const creatorId = approvalResult.project.members[0].user.userId;

		if (projectApproval.approval === "approved") {
			// Set project owner's default rights during the creation of a project
			const setRightsResult = await userRightsService.setProjectOwnerRights(projectId, creatorId);
			if (setRightsResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, setRightsResult.message);
			}
		}

		const username = approvalResult.project.members[0].user.username;
		const usernameCapitalized = username.charAt(0).toUpperCase() + username.slice(1);
		const projectCreatorEmail = approvalResult.project.members[0].user.email;
		const emailTitle = "[Sheepy] Your project has been processed";

		const projectLink = `${process.env.WEBSITE_URL}/project/${projectId}`;

		// Send email notification to admin that new project has been submitted
		const emailInputs = {
			usernameCapitalized,
			projectCreatorEmail,
			projectId,
			projectLink,
			projectTitle: approvalResult.project.title,
			projectApproval,
			emailTitle,
		};

		// Send notification email that project approval has been processed
		const projectApprovalEmailSent = await emailService.sendProjectApprovalEmail(emailInputs);
		if (projectApprovalEmailSent.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectApprovalEmailSent.message);
		}

		return apiResponse.successResponseWithData(res, "Project approval processed successfully and notification email sent.", approvalResult.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

/**
 * Update existing project controller.
 * Allows to update the following elements of a project: title, goal, summary, description, cover, tags, location, talentsNeeded, startDate, phase, objectives, creatorMotivation, visibility
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated project or an error message.
 */
const updateProject = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;

		//Retrieve and initialize project data
		const updatedProjectInputs = {
			title: req.body.projectNewData.title || "",
			goal: req.body.projectNewData.goal || "",
			summary: req.body.projectNewData.summary || "",
			description: req.body.projectNewData.description || "",
			cover: req.body.projectNewData.cover || "",
			locationCountry: req.body.projectNewData.locationCountry || "",
			locationCity: req.body.projectNewData.locationCity || "",
			locationOnlineOnly: req.body.projectNewData.locationOnlineOnly || "no value passed",
			startDate: req.body.projectNewData.startDate || "",
			phase: req.body.projectNewData.phase || "",
			creatorMotivation: req.body.projectNewData.creatorMotivation || "",
			visibility: req.body.projectNewData.visibility || "",
			tags: req.body.projectNewData.tags || [],
			talentsNeeded: req.body.projectNewData.talentsNeeded || [],
			objectives: req.body.projectNewData.objectives || [],
		};

		// Validate input data for updating project
		const validationResult = projectValidation.validateUpdatedProjectInputs(updatedProjectInputs);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Validate Ids for updating a project
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		// Filter on the fields that the user wants to update
		const filterProjectInputs = filterTools.filterProjectFieldsToUpdate(updatedProjectInputs);

		// Retrieve only the keys of filtered fileds to be updated
		const filterProjectInputsArray = Object.keys(filterProjectInputs);

		// Check user rights for updating the project
		const userRights = await userRightsService.validateUserRights(userId, projectId, filterProjectInputsArray);
		if (!userRights.canEdit) {
			return apiResponse.unauthorizedResponse(res, userRights.message);
		}

		// Update the project
		const updateResult = await projectService.updateProject(projectId, filterProjectInputs, userId);
		if (updateResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateResult.message);
		}

		// Retrieve the updated project
		const updatedProject = await projectService.retrieveProjectById(projectId, [
			"-_id",
			"title",
			"goal",
			"summary",
			"description",
			"cover",
			"crush",
			"category",
			"subCategory",
			"location",
			"startDate",
			"creatorMotivation",
			"tags",
			"talentsNeeded",
			"objectives",
			"updatedBy",
			"visibility",
			"statusInfo",
			"privateData",
			"createdAt",
			"members",
			"projectId",
		]);
		if (updatedProject.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedProject.message);
		}

		//Filter users public data from projects
		const projectFiltered = filterTools.filterProjectOutputFields(updatedProject.project, userId);
		if (projectFiltered.status !== "success") {
			return apiResponse.clientErrorResponse(res, projectFiltered.message);
		}

		return apiResponse.successResponseWithData(res, updateResult.message, projectFiltered.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

/**
 * Update the draft section of a project controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created project or an error message.
 */

const updateProjectDraftSection = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;

		//Retrieve and initialize project data
		const projectDraftData = {
			title: req.body.projectDraftData.title || "",
			goal: req.body.projectDraftData.goal || "",
			summary: req.body.projectDraftData.summary || "",
			description: req.body.projectDraftData.description || "",
			cover: req.body.projectDraftData.cover || "",
			locationCountry: req.body.projectDraftData.locationCountry || "",
			locationCity: req.body.projectDraftData.locationCity || "",
			locationOnlineOnly: req.body.projectDraftData.locationOnlineOnly || "no value passed",
			startDate: req.body.projectDraftData.startDate || "",
			phase: req.body.projectDraftData.phase || "",
			creatorMotivation: req.body.projectDraftData.creatorMotivation || "",
			visibility: req.body.projectDraftData.visibility || "",
			tags: req.body.projectDraftData.tags || [],
			talentsNeeded: req.body.projectDraftData.talentsNeeded || [],
			objectives: req.body.projectDraftData.objectives || [],
		};

		// Validate input data for updating project draft section
		const validationResult = projectValidation.validateProjectDraftInputs(projectDraftData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Validate Ids for updating project draft section
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		// Filter on the fields that the user wants to update
		const filterProjectInputs = filterTools.filterProjectFieldsToUpdate(projectDraftData);
		// Retrieve only the keys of filtered fileds to be updated
		const filterProjectInputsArray = Object.keys(filterProjectInputs);
		// Check user rights for updating the project
		const userRights = await userRightsService.validateUserRights(userId, projectId, filterProjectInputsArray);
		if (!userRights.canEdit) {
			return apiResponse.unauthorizedResponse(res, userRights.message);
		}

		// Update the project draft section
		const updatedDraftResult = await projectService.updateProjectDraftSection(projectId, filterProjectInputs, userId);
		if (updatedDraftResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedDraftResult.message);
		}

		// Retrieve the updated project
		const updatedProject = await projectService.retrieveProjectById(projectId, ["-_id", "draft"]);
		if (updatedProject.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedProject.message);
		}

		//Filter users public data from projects
		const projectFiltered = filterTools.filterProjectOutputFields(updatedProject.project, userId);
		if (projectFiltered.status !== "success") {
			return apiResponse.clientErrorResponse(res, projectFiltered.message);
		}

		return apiResponse.successResponseWithData(res, updatedDraftResult.message, { project: projectFiltered.project });
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectPublicData = async (req, res) => {
	try {
		const { projectId = "" } = req.params;

		const projectData = await projectService.retrieveProjectById(
			projectId,
			[
				"-_id",
				"title",
				"goal",
				"summary",
				"description",
				"cover",
				"category",
				"subCategory",
				"location",
				"startDate",
				"creatorMotivation",
				"tags",
				"talentsNeeded",
				"objectives",
				"statusInfo",
				"projectId",
			],
			{ visibility: "public" }
		);
		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}
		//Filter users public data from project
		projectData.project.statusInfo.statusHistory = undefined;
		const projectFiltered = filterTools.filterProjectOutputFields(projectData.project, "unknown");
		if (projectFiltered.status !== "success") {
			return apiResponse.clientErrorResponse(res, projectFiltered.message);
		}
		return apiResponse.successResponseWithData(res, projectData.message, projectFiltered.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveNewProjects = async (req, res) => {
	try {
		const newProjects = await projectService.retrieveProjects(
			["-_id", "title", "summary", "cover", "category", "subCategory", "tags", "visibility", "projectId"],
			{
				visibility: "public",
				"statusInfo.currentStatus": "active",
			},
			4
		);
		if (newProjects.status !== "success") {
			return apiResponse.serverErrorResponse(res, newProjects.message);
		}

		//Filter users public data from projects
		const projectFiltered = filterTools.filterProjectsOutputFields(newProjects.projects, "unknown");
		if (projectFiltered.status !== "success") {
			return apiResponse.clientErrorResponse(res, projectFiltered.message);
		}
		return apiResponse.successResponseWithData(res, newProjects.message, projectFiltered.projects);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveSubmittedProjects = async (req, res) => {
	try {
		const submittedProjects = await projectService.retrieveProjects(
			[
				"-_id",
				"title",
				"goal",
				"summary",
				"description",
				"cover",
				"crush",
				"category",
				"subCategory",
				"location",
				"startDate",
				"creatorMotivation",
				"tags",
				"talentsNeeded",
				"objectives",
				"updatedBy",
				"visibility",
				"statusInfo",
				"privateData",
				"createdAt",
				"members",
				"projectId",
			],
			{
				"statusInfo.currentStatus": "submitted",
			},
			999
		);

		if (submittedProjects.status !== "success") {
			return apiResponse.serverErrorResponse(res, submittedProjects.message);
		}
		return apiResponse.successResponseWithData(res, submittedProjects.message, submittedProjects.projects);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectOverview = async (req, res) => {
	try {
		const { projectId = "" } = req.params;

		// Validate project ID
		const validationResult = idsValidation.validateIdInput(projectId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const projectData = await projectService.retrieveProjectById(projectId, ["-_id", "title", "summary", "cover", "category", "subCategory", "tags", "visibility"], { visibility: "public" });
		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}

		//Filter users public data from projects
		const projectFiltered = filterTools.filterProjectOutputFields(projectData.project, "unknown");
		if (projectFiltered.status !== "success") {
			return apiResponse.clientErrorResponse(res, projectFiltered.message);
		}
		return apiResponse.successResponseWithData(res, projectData.message, projectFiltered.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectData = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;

		// Validate input data for creating a project
		const validationResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		//Retrieve project data
		const projectData = await projectService.retrieveProjectById(projectId, [
			"-_id",
			"title",
			"goal",
			"summary",
			"description",
			"cover",
			"crush",
			"category",
			"subCategory",
			"location",
			"startDate",
			"creatorMotivation",
			"tags",
			"talentsNeeded",
			"objectives",
			"updatedBy",
			"visibility",
			"statusInfo",
			"privateData",
			"createdAt",
			"members",
			"projectId",
		]);
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

		//Filter users public data from projects
		const projectFiltered = filterTools.filterProjectOutputFields(projectData.project, userId);
		if (projectFiltered.status !== "success") {
			return apiResponse.clientErrorResponse(res, projectFiltered.message);
		}
		return apiResponse.successResponseWithData(res, projectData.message, projectFiltered.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const countProjects = async (req, res) => {
	try {
		const projectCount = await projectService.countNumberProjects();

		if (projectCount.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectCount.message);
		}

		return apiResponse.successResponseWithData(res, projectCount.message, projectCount.count);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const countProjectsPerCategory = async (req, res) => {
	try {
		const projectCount = await projectService.countNumberProjectsPerCategory();

		if (projectCount.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectCount.message);
		}

		return apiResponse.successResponseWithData(res, projectCount.message, projectCount.count);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	createProjectDraft,
	updateProjectDraft,
	removeProjectDraft,
	submitProject,
	processProjectApproval,
	updateProject,
	updateProjectDraftSection,
	retrieveProjectPublicData,
	retrieveNewProjects,
	retrieveSubmittedProjects,
	retrieveProjectOverview,
	retrieveProjectData,
	countProjects,
	countProjectsPerCategory,
};
