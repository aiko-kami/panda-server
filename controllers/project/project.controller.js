const {
	projectService,
	categoryService,
	userService,
	userRightsService,
	membersService,
} = require("../../services");
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
			attachments: req.body.projectInputs.attachments || [],
		};

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
		const setRightsResult = await userRightsService.setProjectOwnerRights(
			createResult.project.projectId,
			userId
		);
		if (setRightsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, setRightsResult.message);
		}

		return apiResponse.successResponseWithData(
			res,
			"Project created successfully.",
			createResult.project
		);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

/**
 * Update existing project controller.
 * Allows to update the following elements of a project: title, goal, summary, description, tags, location, talentsNeeded, startDate, phase, objectives, creatorMotivation, visibility
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

		const filterProjectInputsArray = Object.keys(filterProjectInputs);

		// Check user rights for updating the project
		const userRights = await userRightsService.validateUserRights(
			userId,
			projectId,
			filterProjectInputsArray
		);
		if (!userRights.canEdit) {
			return apiResponse.unauthorizedResponse(res, userRights.message);
		}

		//Verify that the title (if modified) is available
		if (filterProjectInputs.title) {
			console.log("there is a title");
			const titleVerification = await projectService.verifyTitleAvailability(
				filterProjectInputs.title
			);
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

const updateProjectStatus = async (req, res) => {};
const addProjectMember = async (req, res) => {};
const removeProjectMember = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;
		const { memberId = "" } = req.body;

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(
			projectId,
			userIdUpdater
		);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canRemoveMembers permission
		if (!rightsCheckResult.projectRights.permissions.canRemoveMembers) {
			return apiResponse.unauthorizedResponse(
				res,
				"You do not have permission to remove members from this project."
			);
		}

		// Remove the member from the project
		const removeMemberResult = await membersService.updateMemberFromProject(
			projectId,
			memberId,
			"remove"
		);
		if (removeMemberResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeMemberResult.message);
		}

		// Remove the user's rights for the project
		const removeUserRightsResult = await userRightsService.removeUserProjectRights(
			projectId,
			memberId
		);
		if (removeUserRightsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeUserRightsResult.message);
		}

		return apiResponse.successResponse(res, "Member removed from the project successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};
const updateProjectAttachments = async (req, res) => {};

module.exports = {
	createProject,
	updateProject,
	updateProjectStatus,
	addProjectMember,
	removeProjectMember,
	updateProjectAttachments,
};
