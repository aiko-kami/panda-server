const { RefreshToken, ResetPasswordToken } = require("../../models");
const { DateTime } = require("luxon");
const { logger } = require("../../utils");

const setTokensInCookies = (res, accessToken, refreshToken) => {
	const isDevelopment = process.env.NODE_ENV === "development";

	res.cookie("access_token", accessToken, {
		httpOnly: isDevelopment, // Set httpOnly to true in production and to false in development
		maxAge: 1000 * parseInt(process.env.ACCESS_TOKEN_EXPIRATION_SECONDS), // Cookie validity duration in milliseconds
		signed: true,
	});

	res.cookie("refresh_token", refreshToken, {
		httpOnly: isDevelopment, // Set httpOnly to true in production and to false in development
		maxAge: 1000 * parseInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS), // Cookie validity duration in milliseconds
		signed: true,
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
		const existingToken = await ResetPasswordToken.find({ userId });

		// If existing token(s) is(are) found, remove former token(s) from the database
		if (existingToken) {
			const deleteResult = await ResetPasswordToken.deleteMany({ userId });

			if (deleteResult.deletedCount > 0) {
				logger.info(
					`Removed ${deleteResult.deletedCount} reset password token(s) from the database. userId: ${userId}`
				);
			}
		}
		const resetPasswordToken = new ResetPasswordToken({
			userId: userId,
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
