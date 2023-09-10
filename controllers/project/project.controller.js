const { projectService, categoryService, userService } = require("../../services");
const { apiResponse, projectValidation, projectTools } = require("../../utils");

/**
 * Create new project controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created project or an error message.
 */
const createProject = async (req, res) => {
	const userId = req.userId;
	//Retrieve and initialize project data
	const projectData = {
		title: req.body.projectInputs.title || "",
		goal: req.body.projectInputs.goal || "",
		summary: req.body.projectInputs.summary || "",
		description: req.body.projectInputs.description || "",
		categoryId: req.body.projectInputs.categoryId || "",
		subCategory: req.body.projectInputs.subCategory || "",
		tagsIds: req.body.projectInputs.tagsIds || [],
		location: req.body.projectInputs.location || { city: "", country: "" },
		talentsNeeded: req.body.projectInputs.talentsNeeded || [],
		startDate: parseInt(req.body.projectInputs.startDate) || 0,
		objectives: req.body.projectInputs.objectives || [],
		creatorMotivation: req.body.projectInputs.creatorMotivation || "",
		visibility: req.body.projectInputs.visibility || "public",
		attachments: req.body.projectInputs.attachments || [],
	};
	try {
		// Validate input data for creating a project
		const validationResult = projectValidation.validateNewProjectInputs(projectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Verify that category and sub-category exist in the database
		const categoryVerified = await categoryService.verifyCategoryAndSubCategoryExist(
			projectData.categoryId,
			projectData.subCategory
		);
		if (categoryVerified.status !== "success") {
			return apiResponse.clientErrorResponse(res, categoryVerified.message);
		}

		projectData.categoryMongo_Id = categoryVerified.category._id;

		//Verify that title does not already exists in the database
		const existingTitle = await projectService.checkTitleAvailability(projectData.title);
		if (existingTitle.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingTitle.message);
		}

		//Verify that user (project creator) exists in the database and convert userId into database _id
		const existingCreator = await userService.retrieveUserById(userId);
		if (existingCreator.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingCreator.message);
		}
		projectData.creatorId = existingCreator.data._id;

		// Create the project
		const createResult = await projectService.createProject(projectData);
		if (createResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, createResult.message);
		}

		return apiResponse.successResponseWithData(
			res,
			"Project created successfully.",
			createResult.data
		);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

/**
 * Update existing project controller.
 * Allows to update the following elements of a project: title, goal, summary, description, tagsIds, location, talentsNeeded, startDate, phase, objectives, creatorMotivation, visibility
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
			tagsIds: req.body.projectNewData.tagsIds || [],
			location: req.body.projectNewData.location || { city: "", country: "" },
			talentsNeeded: req.body.projectNewData.talentsNeeded || [],
			startDate: parseInt(req.body.projectNewData.startDate) || 0,
			phase: req.body.projectNewData.phase || "",
			objectives: req.body.projectNewData.objectives || [],
			creatorMotivation: req.body.projectNewData.creatorMotivation || "",
			visibility: req.body.projectNewData.visibility || "",
		};
		console.log("🚀 ~ updateProject ~ projectId:", projectId);
		console.log("🚀 ~ updateProject ~ userId:", userId);
		console.log("🚀 ~ updateProject ~ updatedProjectInputs:", updatedProjectInputs);

		// Validate input data for updating a project
		const validationResult = projectValidation.validateUpdatedProjectInputs(updatedProjectInputs);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Check user rights for updating the project
		const userRights = await userRightsService.checkUserRights(
			userId,
			projectId,
			updatedProjectInputs
		);
		if (!userRights.canEdit) {
			return apiResponse.unauthorizedResponse(res, userRights.message);
		}

		// Update the project
		const updateResult = await projectService.updateProject(
			projectId,
			updatedProjectInputs,
			userId
		);
		if (updateResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateResult.message);
		}

		return apiResponse.successResponseWithData(
			res,
			"Project updated successfully.",
			updateResult.data
		);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	createProject,
	updateProject,
};
