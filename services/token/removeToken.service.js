const { RefreshToken, ResetPasswordToken } = require("../../models");
const { logger, encryptTools } = require("../../utils");

const deleteAllTokens = async () => {
	try {
		const deletedRefreshTokens = await RefreshToken.deleteMany({});

		logger.info(`Deleted ${deletedRefreshTokens.deletedCount} refresh tokens.`);
		return {
			status: "success",
			message: `Deleted ${deletedRefreshTokens.deletedCount} refresh tokens.`,
		};
	} catch (error) {
		logger.error("Error while deleting tokens: ", error);
		return {
			status: "error",
			message: "An error occurred while deleting tokens.",
		};
	}
};

const removeRefreshTokenFromDatabase = async (refreshToken) => {
	try {
		// Find and remove the refresh token associated with the given user ID
		const removeResult = await RefreshToken.findOneAndDelete(refreshToken);

		if (!removeResult) {
			return { status: "error", message: "Refresh token not found." };
		}

		logger.info(`Refresh token removed from database: ${refreshToken}`);
		return { status: "success", message: "Refresh token removed from database." };
	} catch (error) {
		logger.error("Error while removing refresh token from database: ", error);
		return {
			status: "error",
			message: "An error occurred while removing refresh token from database.",
		};
	}
};

const removeResetPasswordTokenFromDatabase = async (userId, resetToken) => {
	try {
		// Convert id to ObjectId
		const ObjectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (ObjectIdUserId.status == "error") {
			return { status: "error", message: ObjectIdUserId.message };
		}

		// Find and remove the reset password token associated with the given user ID
		const removeResult = await ResetPasswordToken.findOneAndDelete({ user: ObjectIdUserId, token: resetToken });

		if (!removeResult) {
			return { status: "error", message: "Reset password token not found." };
		}

		logger.info(`Reset password token removed from database: ${resetToken}`);
		return { status: "success", message: "Reset password token removed from database." };
	} catch (error) {
		logger.error("Error while removing reset password token from database: ", error);
		return {
			status: "error",
			message: "An error occurred while removing reset password token from database.",
		};
	}
};

module.exports = {
	deleteAllTokens,
	removeRefreshTokenFromDatabase,
	removeResetPasswordTokenFromDatabase,
};
