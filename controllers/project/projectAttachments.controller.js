const { projectService, uploadService, attachmentService } = require("../../services");
const { apiResponse, projectValidation, uploadFiles, encryptTools } = require("../../utils");
const path = require("path");

/**
 * Project attachments controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated project or an error message.
 */
const addProjectAttachment = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;
		const attachmentTitle = req.body.attachmentTitle || "default_title000001";

		// Validate Ids
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		// Validate Ids
		const validationTitleResult = projectValidation.validateAttachmentTitle(attachmentTitle);
		if (validationTitleResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationTitleResult.message);
		}

		// Verify that query contains an input file
		const inputFileCheckResult = uploadFiles.checkInputFile(req);
		if (inputFileCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, inputFileCheckResult.message);
		}
		if (!inputFileCheckResult.isFile) {
			return apiResponse.clientErrorResponse(res, inputFileCheckResult.message);
		}

		// Verify that user can update the project attachments
		const projectWrongStatus = ["submitted", "archived", "cancelled", "rejected"];
		const canUpdateResult = await projectService.canUpdateProject(projectId, userId, "canEditAttachments", projectWrongStatus, attachmentTitle);
		if (canUpdateResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, canUpdateResult.message);
		}
		if (canUpdateResult.userCanEdit !== true) {
			return apiResponse.unauthorizedResponse(res, canUpdateResult.message);
		}

		// If new file is present in the request, upload new file to AWS
		const uploadFileResult = await uploadService.uploadAttachment(req, res, projectId, attachmentTitle);
		if (uploadFileResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, uploadFileResult.message);
		}

		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return apiResponse.serverErrorResponse(res, objectIdUserId.message);
		}

		const attachmentExtension = path.extname(req.file.key).slice(1) || "";

		//Set new cover link in the data to update the database
		const updatedProjectData = {
			attachmentTitle,
			attachmentSize: req.file.size || "",
			attachmentExtension,
			attachmentMimetype: req.file.contentType || "",
			attachmentKey: req.file.key || "",
			attachmentLink: req.file.location || "",
			attachmentUpdatedBy: objectIdUserId,
		};

		// Add new cover link to database (replace with new link or simply remove the former one if there is no new input)
		const updateAttachmentResult = await attachmentService.addAttachment(projectId, updatedProjectData, userId);
		if (updateAttachmentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateAttachmentResult.message);
		}

		return apiResponse.successResponseWithData(res, "Project attachment added successfully.", updatedProjectData.attachmentLink);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const RenameProjectAttachment = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;
		const attachmentKey =
			req.body.attachmentKey ||
			"project_attachments/ec154302ac2ddbcdaf2a726cc5f7c75d-3518108473552f6bb13cfa6bb9803e7faea9034c0ce0d0b51709979628367__projectAttachments__ec154302ac2ddbcdaf2a726cc5f7c75d-3518108473552f6bb13cfa6bb9803e7faea9034c0ce0d0b5__default_title000001.png";
		const attachmentNewTitle = req.body.attachmentNewTitle || "default_new_final";

		// Validate Ids
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		// Validate Ids
		const validationTitleResult = projectValidation.validateAttachmentKeyAndTitle(attachmentKey, attachmentNewTitle);
		if (validationTitleResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationTitleResult.message);
		}

		// Verify that user can update the project attachments
		const projectWrongStatus = ["submitted", "archived", "cancelled", "rejected"];
		const canUpdateResult = await projectService.canUpdateProject(projectId, userId, "canEditAttachments", projectWrongStatus, attachmentNewTitle);
		if (canUpdateResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, canUpdateResult.message);
		}
		if (canUpdateResult.userCanEdit !== true) {
			return apiResponse.unauthorizedResponse(res, canUpdateResult.message);
		}

		// Rename file in AWS
		const renameFileResult = await uploadFiles.renameFile(projectId, attachmentKey, attachmentNewTitle);
		if (renameFileResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, renameFileResult.message);
		}

		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return apiResponse.serverErrorResponse(res, objectIdUserId.message);
		}

		//Set new cover link in the data to update the database
		const updatedProjectData = {
			attachmentTitle: attachmentNewTitle,
			attachmentSize: renameFileResult.file.size,
			attachmentExtension: renameFileResult.file.extension,
			attachmentMimetype: renameFileResult.file.mimetype,
			attachmentKey: renameFileResult.file.key,
			attachmentLink: renameFileResult.file.link,
			attachmentUpdatedBy: objectIdUserId,
		};

		// Add new cover link to database (replace with new link or simply remove the former one if there is no new input)
		const updateAttachmentResult = await attachmentService.UpdateAttachment(projectId, attachmentKey, updatedProjectData, userId);
		if (updateAttachmentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateAttachmentResult.message);
		}

		return apiResponse.successResponseWithData(res, "Project attachment updated successfully.", updatedProjectData.attachmentLink);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const deleteProjectAttachment = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;

		// Validate Ids
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		// Verify that user can update the project attachments
		const canUpdateResult = await projectService.canUpdateProjectCover(projectId, userId, ["cover"]);
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

const retrieveProjectAttachments = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;

		// Validate Ids
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		// Verify that user can update the project attachments
		const canUpdateResult = await projectService.canUpdateProjectCover(projectId, userId, ["cover"]);
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

const retrieveProjectAttachment = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;

		// Validate Ids
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		// Verify that user can update the project attachments
		const canUpdateResult = await projectService.canUpdateProjectCover(projectId, userId, ["cover"]);
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

module.exports = {
	addProjectAttachment,
	RenameProjectAttachment,
	deleteProjectAttachment,
	retrieveProjectAttachments,
	retrieveProjectAttachment,
};
