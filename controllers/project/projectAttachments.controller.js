const { projectService, uploadService, attachmentService } = require("../../services");
const { apiResponse, projectValidation, uploadFiles, filterTools, encryptTools } = require("../../utils");
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
		const attachmentTitle = req.body.attachmentTitle || "";

		// Validate Ids
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

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
		const canUpdateResult = await projectService.canUpdateProject({ projectId, userId, permission: "canEditAttachments", projectWrongStatus, attachmentTitle });
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

		const attachmentExtension = path.extname(req.file.key).slice(1) || "";

		//Set data to update the database
		const updatedProjectData = {
			attachmentTitle,
			attachmentSize: req.file.size || "",
			attachmentExtension,
			attachmentMimetype: req.file.contentType || "",
			attachmentKey: req.file.key || "",
			attachmentLink: req.file.location || "",
		};

		// Update attachment data in database
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
		const attachmentKey = req.body.attachmentKey || "";
		const attachmentNewTitle = req.body.attachmentNewTitle || "";

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
		const canUpdateResult = await projectService.canUpdateProject({ projectId, userId, permission: "canEditAttachments", projectWrongStatus, attachmentNewTitle });
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

		//Set data to update the database
		const updatedProjectData = {
			attachmentTitle: attachmentNewTitle,
			attachmentSize: renameFileResult.file.size,
			attachmentExtension: renameFileResult.file.extension,
			attachmentMimetype: renameFileResult.file.mimetype,
			attachmentKey: renameFileResult.file.key,
			attachmentLink: renameFileResult.file.link,
		};

		// Update attachment data in database
		const updateAttachmentResult = await attachmentService.updateAttachment(projectId, attachmentKey, updatedProjectData, userId);
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
		const attachmentKey = req.body.attachmentKey || "";

		// Validate Ids
		const validationIdsResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		// Validate Ids
		const validationTitleResult = projectValidation.validateAttachmentKey(attachmentKey);
		if (validationTitleResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationTitleResult.message);
		}

		// Verify that user can update the project attachments
		const projectWrongStatus = ["submitted", "archived", "cancelled", "rejected"];
		const canUpdateResult = await projectService.canUpdateProject({ projectId, userId, permission: "canEditAttachments", projectWrongStatus, attachmentKey });
		if (canUpdateResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, canUpdateResult.message);
		}
		if (canUpdateResult.userCanEdit !== true) {
			return apiResponse.unauthorizedResponse(res, canUpdateResult.message);
		}

		// Delete file in AWS
		const deleteFileResult = await uploadFiles.deleteFile(attachmentKey);
		if (deleteFileResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, deleteFileResult.message);
		}

		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return apiResponse.serverErrorResponse(res, objectIdUserId.message);
		}

		// Add new cover link to database (replace with new link or simply remove the former one if there is no new input)
		const updateAttachmentResult = await attachmentService.deleteAttachment(projectId, attachmentKey, userId);
		if (updateAttachmentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateAttachmentResult.message);
		}

		return apiResponse.successResponseWithData(res, "Project attachment removed successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectAttachments = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;

		// Validate input data
		const validationResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		//Retrieve attachments
		const attachmentsResult = await attachmentService.retrieveAttachments(projectId, userId);
		if (attachmentsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, attachmentsResult.message);
		}

		return apiResponse.successResponseWithData(res, attachmentsResult.message, { attachments: attachmentsResult.attachments });
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectAttachment = async (req, res) => {
	try {
		const { projectId = "" } = req.params;
		const userId = req.userId;
		const attachmentTitle = req.body.attachmentTitle || "";

		// Validate input data
		const validationResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const validationTitleResult = projectValidation.validateAttachmentTitle(attachmentTitle);
		if (validationTitleResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationTitleResult.message);
		}

		//Retrieve attachments
		const attachmentResult = await attachmentService.retrieveAttachment(projectId, userId, attachmentTitle);
		if (attachmentResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, attachmentResult.message);
		}

		return apiResponse.successResponseWithData(res, "Project attachment retrieved successfully.", { attachment: attachmentResult.attachment });
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
