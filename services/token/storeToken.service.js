const { RefreshToken, ResetPasswordToken } = require("../models");
const { DateTime } = require("luxon");
const { logger } = require("../utils");

const setTokensInCookies = (res, accessToken, refreshToken) => {
	res.cookie("access_token", accessToken, {
		httpOnly: true,
		secure: true,
		maxAge: 1000 * parseInt(process.env.ACCESS_TOKEN_EXPIRATION_SECONDS), // Cookie validity duration in milliseconds
	});

	res.cookie("refresh_token", refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: 1000 * parseInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS), // Cookie validity duration in milliseconds
	});
};

const storeRefreshTokenInDatabase = async (userId, refreshTokenToStore) => {
	try {
		// Check if a refresh token already exists for the user
		const existingToken = await RefreshToken.findOne({ userId });

		// If an existing token is found, remove former token from the database
		if (existingToken) {
			await existingToken.deleteOne();
			logger.info(`Existing refresh token removed from database. userId: ${userId}`);
		}

		const refreshToken = new RefreshToken({
			userId: userId,
			createdAt: DateTime.now(),
			token: refreshTokenToStore,
		});

		await refreshToken.save();

		logger.info(`Refresh token stored in database. refreshToken: ${refreshToken}`);
		return {
			status: "success",
			message: "Refresh token stored in database.",
			data: { refreshToken },
		};
	} catch (error) {
		logger.error("Error while storing refresh token in database: ", error);
		return {
			status: "error",
			message: "An error occurred while storing Refresh token in database.",
		};
	}
};

const storeResetPasswordTokenInDatabase = async (userId, ResetPasswordTokenToStore) => {
	try {
		// Check if a reset password token already exists for the user
		const existingToken = await ResetPasswordToken.findOne({ userId });

		// If an existing token is found, remove former token from the database
		if (existingToken) {
			await existingToken.deleteOne();
			logger.info(`Existing reset password token removed from database. userId: ${userId}`);
		}

		const resetPasswordToken = new ResetPasswordToken({
			userId: userId,
			createdAt: DateTime.now(),
			token: ResetPasswordTokenToStore,
		});

		await resetPasswordToken.save();

		logger.info(
			`Reset password token stored in database. ResetPasswordToken: ${resetPasswordToken}`
		);
		return {
			status: "success",
			message: "Reset password token stored in database.",
			data: { resetPasswordToken },
		};
	} catch (error) {
		logger.error("Error while storing reset password token in database: ", error);
		return {
			status: "error",
			message: "An error occurred while storing reset password token in database.",
		};
	}
};

module.exports = {
	setTokensInCookies,
	storeRefreshTokenInDatabase,
	storeResetPasswordTokenInDatabase,
};
