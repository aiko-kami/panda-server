const { projectService, categoryService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

/**
 * Create new project controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created project or an error message.
 */

// Create project
const createProject = async (req, res) => {
	//Retrieve and initialize project data
	const projectData = {
		title: req.body.projectInputs.title || "",
		goal: req.body.projectInputs.goal || "",
		summary: req.body.projectInputs.summary || "",
		description: req.body.projectInputs.description || "",
		categoryId: req.body.projectInputs.categoryId || "",
		subCategoryId: req.body.projectInputs.subCategoryId || "",
		tagsIds: req.body.projectInputs.tagsIds || "",
		members: req.body.projectInputs.members || "",
		location: req.body.projectInputs.location || { city: "", country: "" },
		skillsNeeded: req.body.projectInputs.skillsNeeded || "",
		startDate: parseInt(req.body.projectInputs.startDate) || 0,
		projectObjectives: req.body.projectInputs.projectObjectives || "",
		creatorMotivation: req.body.projectInputs.creatorMotivation || "",
		visibility: req.body.projectInputs.visibility || "public",
		attachments: req.body.projectInputs.attachments || "",
	};

	try {
		// Validate input data for creating a project
		const validationResult = validation.validateNewProjectInputs(projectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Verify that category exists in the database
		const categoryVerified = await categoryService.verifyCategoryExists(projectData.categoryId);

		if (categoryVerified.status !== "success") {
			return apiResponse.clientErrorResponse(res, categoryVerified.message);
		}

		//Verify that title does not already exists in the database
		const existingTitle = await projectService.checkTitleAvailability(projectData.title);
		if (existingTitle.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingTitle.message);
		}

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
