const { projectService, categoryService, userService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

/**
 * Create new project controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created project or an error message.
 */

// Create project
const createProject = async (req, res) => {
	try {
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
			objectives: req.body.projectInputs.objectives || "",
			creatorMotivation: req.body.projectInputs.creatorMotivation || "",
			visibility: req.body.projectInputs.visibility || "public",
			attachments: req.body.projectInputs.attachments || "",
		};

		// Validate input data for creating a project
		const validationResult = validation.validateNewProjectInputs(projectData);
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
		const existingCreator = await userService.retrieveUserById(req.userId);
		if (existingCreator.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingCreator.message);
		}
		projectData.creatorId = existingCreator.data._id;

		// Create the project
		const createResult = await projectService.createProject(projectData);
		if (createResult.status === "success") {
			return apiResponse.successResponseWithData(
				res,
				"Project created successfully.",
				createResult.data
			);
		} else {
			return apiResponse.serverErrorResponse(res, createResult.message);
		}
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	createProject,
};
