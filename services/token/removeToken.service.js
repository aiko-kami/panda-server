const { RefreshToken, ResetPasswordToken } = require("../models");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const v4 = require("uuid").v4;
const { DateTime } = require("luxon");
const { logger } = require("../utils");

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

module.exports = {
	deleteAllTokens,
	removeRefreshTokenFromDatabase,
};
