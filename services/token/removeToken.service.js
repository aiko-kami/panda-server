const { RefreshToken, ResetPasswordToken } = require("../../models");
const { logger } = require("../../utils");

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
		const removeResult = await RefreshToken.findOneAndRemove(refreshToken);

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
		// Find and remove the reset password token associated with the given user ID
		const removeResult = await ResetPasswordToken.findOneAndRemove({ userId, token: resetToken });

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
