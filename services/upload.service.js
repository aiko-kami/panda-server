const { logger, uploadFiles } = require("../utils");

const uploadProfilePicture = async (req, res, userId) => {
	return new Promise((resolve, reject) => {
		try {
			const fileName = "__profilePicture__" + userId;

			const singleUpload = uploadFiles.fileUpload(req, "user_profile_pictures/", fileName).single("image");

			singleUpload(req, res, function (error) {
				if (error) {
					logger.error("Error uploading file:", error);

					return reject({
						status: "error",
						message: "Image Upload Error",
						detail: error.message,
						error: error,
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

const uploadCover = async (req, res, projectId) => {
	return new Promise((resolve, reject) => {
		try {
			const fileName = "__projectCover__" + projectId;

			const singleUpload = uploadFiles.fileUpload(req, "project_covers/", fileName).single("image");

			singleUpload(req, res, function (error) {
				if (error) {
					logger.error("Error uploading file:", error);

					return reject({
						status: "error",
						message: "Image Upload Error",
						detail: error.message,
						error: error,
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

module.exports = {
	uploadProfilePicture,
	uploadCover,
};
