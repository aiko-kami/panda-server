const { projectService, userService, userRightsService, uploadService } = require("../../services");
const { apiResponse, projectValidation, encryptTools, uploadFiles } = require("../../utils");

/**
 * Create new project draft controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created project or an error message.
 */
const updateCover = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;

		// Validate Ids
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}

		//Verify that user (project creator) exists in the database
		const existingCreator = await userService.retrieveUserById(userId, ["-_id"]);
		if (existingCreator.status !== "success") {
			return apiResponse.clientErrorResponse(res, existingCreator.message);
		}

		// Retrieve the updated project
		const projectRetrieved = await projectService.retrieveProjectById(projectId, ["-_id", "cover", "statusInfo", "createdBy"]);
		if (projectRetrieved.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectRetrieved.message);
		}

		if (projectRetrieved.project.statusInfo.currentStatus === "submitted") {
			return apiResponse.serverErrorResponse(res, "You cannot update a project for which status is SUBMITTED.");
		}
		if (projectRetrieved.project.statusInfo.currentStatus === "draft") {
			if (projectRetrieved.project.createdBy.toString() !== objectIdUserIdUpdater.toString()) {
				return apiResponse.serverErrorResponse(res, "Only the creator of the project can update it.");
			} else {
				//upload project cover
				//
			}
		}

		//
		// Create function in service to check if user can update the cover of the project
		//Either due to the status of the project or due to user rights
		//

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditCover permission
		if (!rightsCheckResult.projectRights.permissions.canEditCover) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update cover for this project.");
		}

		const formerCover = projectRetrieved.project.cover.key;
		const isFormerCoverPresent = formerCover !== "" && formerCover !== undefined;

		// Verify that query contains an input file
		const inputFileCheckResult = uploadFiles.checkInputFile(req);
		if (inputFileCheckResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, inputFileCheckResult.message);
		}

		const isNewCoverPresent = inputFileCheckResult.isFile;

		// If new cover is present in the request, upload new cover to AWS
		if (isNewCoverPresent) {
			const uploadCoverResult = await uploadService.uploadCover(req, res, projectId);
			if (uploadCoverResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, uploadCoverResult.message);
			}
		}

		// Remove former cover from AWS
		if (isFormerCoverPresent) {
			const deleteCoverResult = await uploadFiles.deleteFile(formerCover);
			if (deleteCoverResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, deleteCoverResult.message);
			}
		}

		const coverKey = req.file.key || "";
		const coverLink = req.file.location || "";

		//Set new cover link in the data to update the database
		const updatedProjectData = {
			coverKey,
			coverLink,
		};

		// Add new cover link to database (replace with new link or simply remove the former one if there is no new input)
		const updateCoverResult = await projectService.updateProject(projectId, updatedProjectData, userId);
		if (updateCoverResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateCoverResult.message);
		}

		return apiResponse.successResponseWithData(res, "Project cover updated successfully.", coverLink);
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
const updateCoverDraft = async (req, res) => {
	try {
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	updateCover,
	updateCoverDraft,
};
