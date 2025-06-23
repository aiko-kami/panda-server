const { logger, uploadFiles } = require("../utils");
const { FILE_SIZE_LIMITS, FILE_SIZE_ERRORS, ALLOWED_FILE_TYPES, UPLOAD_PATHS } = require("../config/uploadConfig");

const uploadProfilePicture = async (req, res, userId) => {
	return new Promise((resolve, reject) => {
		try {
			const fileName = "__profilePicture__" + userId;

			const singleUpload = uploadFiles.fileUpload(req, UPLOAD_PATHS.profilePicture, fileName, ALLOWED_FILE_TYPES.profilePicture, FILE_SIZE_LIMITS.profilePicture).single("image");

			singleUpload(req, res, function (error) {
				if (error) {
					if (error.code === "LIMIT_FILE_SIZE") {
						return reject({
							status: "error",
							message: FILE_SIZE_ERRORS.profilePicture,
						});
					}

					return reject({
						status: "error",
						message: `File upload failed: ${error.message}`,
					});
				}

				logger.info("User profile picture uploaded successfully.");
				resolve({ status: "success", message: "User profile picture uploaded successfully." }); // Resolve with req.file object
			});
		} catch (error) {
			logger.error("Error uploading user profile picture:", error);
			return { status: "error", message: "An error occurred while uploading user profile picture." };
		}
	});
};

const uploadBackgroundPicture = async (req, res, userId) => {
	return new Promise((resolve, reject) => {
		try {
			const fileName = "__backgroundPicture__" + userId;

			const singleUpload = uploadFiles.fileUpload(req, UPLOAD_PATHS.backgroundPicture, fileName, ALLOWED_FILE_TYPES.backgroundPicture, FILE_SIZE_LIMITS.backgroundPicture).single("image");

			singleUpload(req, res, function (error) {
				if (error) {
					if (error.code === "LIMIT_FILE_SIZE") {
						return reject({
							status: "error",
							message: FILE_SIZE_ERRORS.backgroundPicture,
						});
					}

					return reject({
						status: "error",
						message: `File upload failed: ${error.message}`,
					});
				}

				logger.info("User background picture uploaded successfully.");
				resolve({ status: "success", message: "User background picture uploaded successfully." }); // Resolve with req.file object
			});
		} catch (error) {
			logger.error("Error uploading user background picture:", error);
			return { status: "error", message: "An error occurred while uploading user background picture." };
		}
	});
};

const uploadCover = async (req, res, projectId) => {
	return new Promise((resolve, reject) => {
		try {
			const fileName = "__projectCover__" + projectId;

			const singleUpload = uploadFiles.fileUpload(req, UPLOAD_PATHS.cover, fileName, ALLOWED_FILE_TYPES.cover, FILE_SIZE_LIMITS.cover).single("image");

			singleUpload(req, res, function (error) {
				if (error) {
					if (error.code === "LIMIT_FILE_SIZE") {
						return reject({
							status: "error",
							message: FILE_SIZE_ERRORS.cover,
						});
					}

					return reject({
						status: "error",
						message: `File upload failed: ${error.message}`,
					});
				}

				logger.info("Project cover uploaded successfully.");
				resolve({ status: "success", message: "Project cover uploaded successfully." });
			});
		} catch (error) {
			logger.error("Error uploading project cover:", error);
			return { status: "error", message: "An error occurred while uploading project cover." };
		}
	});
};

const uploadAttachment = async (req, res, projectId, attachmentTitle) => {
	return new Promise((resolve, reject) => {
		try {
			const fileName = "__projectAttachments__" + projectId + "__" + attachmentTitle;

			const singleUpload = uploadFiles.fileUpload(req, UPLOAD_PATHS.attachment(projectId), fileName, ALLOWED_FILE_TYPES.attachment, FILE_SIZE_LIMITS.attachment).single("file");

			singleUpload(req, res, function (error) {
				if (error) {
					if (error.code === "LIMIT_FILE_SIZE") {
						return reject({
							status: "error",
							message: FILE_SIZE_ERRORS.attachment,
						});
					}

					return reject({
						status: "error",
						message: `File upload failed: ${error.message}`,
					});
				}

				logger.info("Project attachment uploaded successfully.");
				resolve({ status: "success", message: "Project attachment uploaded successfully." });
			});
		} catch (error) {
			logger.error("Error uploading project attachment:", error);
			return { status: "error", message: "An error occurred while uploading project attachment." };
		}
	});
};

module.exports = {
	uploadProfilePicture,
	uploadBackgroundPicture,
	uploadCover,
	uploadAttachment,
};
