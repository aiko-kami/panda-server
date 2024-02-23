const { logger, uploadFiles } = require("../utils");

const uploadPicture = async (req, res, userId) => {
	try {
		const fileName = "__profilePicture__" + userId;

		const singleUpload = uploadFiles.fileUpload("user_profile_pictures/", fileName).single("Image");
		singleUpload(req, res, function (err) {
			if (err) {
				return res.json({
					success: false,
					errors: {
						title: "Image Upload Error",
						detail: err.message,
						error: err,
					},
				});
			}
		});
		logger.info("User profile picture uploaded successfully.");
		return { status: "success", message: "User profile picture uploaded successfully." };
	} catch (error) {
		logger.error("Error uploading user profile picture:", error);
		return { status: "error", message: "An error occurred while uploading user profile picture." };
	}
};

module.exports = {
	uploadPicture,
};
