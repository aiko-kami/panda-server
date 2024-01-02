const { projectService, categoryService, userService, userRightsService, adminService } = require("../../services");
const { apiResponse, projectValidation, projectTools, encryptTools } = require("../../utils");

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
		const filterProjectInputs = projectTools.filterFieldsToUpdate(projectDataToUpdate);

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
			status: "submitted",
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

		let projectSubmittedResult;
		if (!projectId) {
			// Create the project and set project status to submitted
			projectSubmittedResult = await projectService.createProject(projectData, userId);

			console.log("🚀 ~ submitProject ~ projectSubmittedResult:", projectSubmittedResult);

			if (projectSubmittedResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, projectSubmittedResult.message);
			}
		} else if (projectId) {
			// Filter on the fields that the user wants to update
			const filterProjectInputs = projectTools.filterFieldsToUpdate(projectData);

			// Update the project
			projectSubmittedResult = await projectService.updateProjectDraft(projectId, filterProjectInputs, userId);
			if (projectSubmittedResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, projectSubmittedResult.message);
			}
		}

		// Send email notification to admin that new project has been submitted

		return apiResponse.successResponseWithData(res, projectSubmittedResult.message, projectSubmittedResult.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const processProjectApproval = async (req, res) => {
	try {
		const { projectId = "" } = req.params;

		const projectApproval = {
			approval: req.body.projectApprovalInputs.approval || "",
			reason: req.body.projectApprovalInputs.reason || "",
		};

		const adminUserId = req.userId;

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
		const existingCreator = await adminService.retrieveUserById(adminUserId, ["-_id"]);
		if (existingCreator.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingCreator.message);
		}

		// Update the project
		//adminUserId is useless today (who did the update is not logged in the DB)
		const updatedResult = await projectService.processProjectApproval(projectId, projectApproval, adminUserId);
		if (updatedResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedResult.message);
		}

		const creatorId = updatedResult.project.owner;

		// Set project owner's default rights during the creation of a project
		const setRightsResult = await userRightsService.setProjectOwnerRights(projectId, creatorId);
		if (setRightsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, setRightsResult.message);
		}

		// Send notification email that project approval has been processed

		return apiResponse.successResponseWithData(res, updatedResult.message, updatedResult.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const saveProjectDraft = async (req, res) => {
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
		};

		// Validate input data for creating a project
		const validationResult = projectValidation.validateNewProjectInputs(projectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Verify that category and sub-category exist in the database
		const categoryVerified = await categoryService.verifyCategoryAndSubCategoryExist(projectData.categoryId, projectData.subCategory);
		if (categoryVerified.status !== "success") {
			return apiResponse.clientErrorResponse(res, categoryVerified.message);
		}

		//Verify that user (project creator) exists in the database
		const existingCreator = await userService.retrieveUserById(userId, ["-_id"]);
		if (existingCreator.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingCreator.message);
		}

		projectData.creatorId = userId;

		// Create the project
		const createResult = await projectService.createProject(projectData);

		if (createResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, createResult.message);
		}

		// Set project owner's default rights during the creation of a project
		const setRightsResult = await userRightsService.setProjectOwnerRights(createResult.project.projectId, userId);
		if (setRightsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, setRightsResult.message);
		}

		//Retrieve project data
		const projectOutput = await projectService.retrieveProjectById(createResult.project.projectId, ["-_id", "-members._id"]);
		if (projectOutput.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectOutput.message);
		}

		//Convert database object to JS object
		projectOutput.project = projectOutput.project.toObject();

		//remove _id for the output data
		const finalProjectOutput = {
			...projectOutput.project,
			members: projectOutput.project.members.map((member) => ({
				...member,
				user: { ...member.user, _id: undefined },
			})),
		};

		return apiResponse.successResponseWithData(res, createResult.message, finalProjectOutput);
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

		// Validate input data for updating a project
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
		const filterProjectInputs = projectTools.filterFieldsToUpdate(updatedProjectInputs);

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

		return apiResponse.successResponseWithData(res, updateResult.message, updateResult);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectPublicData = async (req, res) => {
	try {
		const { projectId = "" } = req.params;

		const projectData = await projectService.retrieveProjectById(
			projectId,
			["-_id", "title", "goal", "summary", "description", "cover", "category", "subCategory", "location", "startDate", "creatorMotivation", "tags", "talentsNeeded", "objectives", "visibility"],
			{ visibility: "public" }
		);

		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}

		return apiResponse.successResponseWithData(res, projectData.message, projectData.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveNewProjects = async (req, res) => {
	try {
		const newProjects = await projectService.retrieveLatestProjects(4, ["-_id", "title", "summary", "cover", "category", "subCategory", "tags", "visibility"], {
			visibility: "public",
			status: "active",
		});

		if (newProjects.projects !== null && newProjects.projects.length > 0) {
			return apiResponse.successResponseWithData(res, newProjects.message, newProjects.projects);
		} else {
			return apiResponse.serverErrorResponse(res, newProjects.message);
		}
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectOverview = async (req, res) => {
	try {
		const { projectId = "" } = req.params;

		const projectData = await projectService.retrieveProjectById(projectId, ["-_id", "title", "summary", "cover", "category", "subCategory", "tags", "visibility"], { visibility: "public" });

		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}

		return apiResponse.successResponseWithData(res, projectData.message, projectData.project);
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

		//Retrieve proeject data
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
			"status",
			"privateData",
			"createdAt",
			"members",
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
		const isUserProjectMember = projectMembers.find((member) => member.user._id.toString() === objectIdUserId.toString());

		// If user is not member of the project, return error
		if (!isUserProjectMember) {
			return apiResponse.unauthorizedResponse(res, "Data only available for the members of the project.");
		}

		//remove _id for the output data
		const updatedObject = {
			...projectData.project,
			members: projectData.project.members.map((member) => ({
				...member,
				user: { ...member.user, _id: undefined },
			})),
		};

		return apiResponse.successResponseWithData(res, projectData.message, updatedObject);
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
	updateProject,
	retrieveProjectPublicData,
	retrieveNewProjects,
	retrieveProjectOverview,
	retrieveProjectData,
	countProjects,
	countProjectsPerCategory,

	processProjectApproval,
	saveProjectDraft,
};
