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

		// Verify that user can update the project cover
		const canUpdateResult = await projectService.canUpdateProject(projectId, userId, ["cover"]);
		if (canUpdateResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, canUpdateResult.message);
		}
		if (canUpdateResult.userCanEditCover !== true) {
			return apiResponse.unauthorizedResponse(res, canUpdateResult.message);
		}

		const formerCover = canUpdateResult.project.cover.key;
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
