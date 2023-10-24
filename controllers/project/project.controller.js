const { projectService, categoryService, userService, userRightsService } = require("../../services");
const { apiResponse, projectValidation, projectTools } = require("../../utils");

/**
 * Create new project controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created project or an error message.
 */
const createProject = async (req, res) => {
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

		//Verify that title does not already exists in the database
		const existingTitle = await projectService.verifyTitleAvailability(projectData.title);
		if (existingTitle.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingTitle.message);
		}

		//Verify that user (project creator) exists in the database
		const existingCreator = await userService.retrieveUserById(userId, "-_id");
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

		return apiResponse.successResponseWithData(res, "Project created successfully.", createResult.project);
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

		// Filter on the fields that the user wants to update
		const filterProjectInputs = projectTools.filterFieldsToUpdate(updatedProjectInputs);

		// Retrieve only the keys of filtered fileds to be updated
		const filterProjectInputsArray = Object.keys(filterProjectInputs);

		// Check user rights for updating the project
		const userRights = await userRightsService.validateUserRights(userId, projectId, filterProjectInputsArray);
		if (!userRights.canEdit) {
			return apiResponse.unauthorizedResponse(res, userRights.message);
		}

		//Verify that the title (if modified) is available
		if (filterProjectInputs.title) {
			const titleVerification = await projectService.verifyTitleAvailability(filterProjectInputs.title);
			if (titleVerification.status !== "success") {
				return apiResponse.serverErrorResponse(res, titleVerification.message);
			}
		}

		// Update the project
		const updateResult = await projectService.updateProject(projectId, filterProjectInputs, userId);
		if (updateResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateResult.message);
		}

		return apiResponse.successResponseWithData(res, "Project updated successfully.", updateResult);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectPublicData = async (req, res) => {
	try {
		const { projectId = "" } = req.params;

		console.log("🚀 ~ retrieveProjectPublicData ~ projectId:", projectId);

		const projectData = await projectService.retrieveProjectById(
			projectId,
			"-_id title	goal summary description cover category subCategory location startDate creatorMotivation tags talentsNeeded objectives visibility",
			{ visibility: "public" }
		);

		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}

		return apiResponse.successResponseWithData(res, "Project retrieved successfully.", projectData.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveNewProjects = async (req, res) => {
	try {
		const newProjects = await projectService.retrieveLatestProjects(4, "-_id title summary cover category subCategory tags visibility", { visibility: "public" });

		if (newProjects.projects !== null && newProjects.projects.length > 0) {
			return apiResponse.successResponseWithData(res, "New projects retrieved successfully.", newProjects.projects);
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

		const projectData = await projectService.retrieveProjectById(projectId, "-_id title summary cover category subCategory tags visibility", { visibility: "public" });

		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}

		if (projectData.project.visibility !== "public") {
			return apiResponse.serverErrorResponse(res, "Project not found.");
		}

		return apiResponse.successResponseWithData(res, "Project overview retrieved successfully.", projectData.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectData = async (req, res) => {};

const countProjects = async (req, res) => {
	try {
		const projectCount = await projectService.countNumberProjects();

		if (projectCount.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectCount.message);
		}

		return apiResponse.successResponseWithData(res, "Number of projects retrieved successfully.", projectCount.count);
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

		return apiResponse.successResponseWithData(res, "Number of projects retrieved successfully.", projectCount.count);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	createProject,
	updateProject,
	retrieveProjectPublicData,
	retrieveNewProjects,
	retrieveProjectOverview,
	retrieveProjectData,
	countProjects,
	countProjectsPerCategory,
};
