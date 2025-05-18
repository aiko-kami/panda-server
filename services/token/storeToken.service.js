const { RefreshToken, ResetPasswordToken } = require("../../models");
const { DateTime } = require("luxon");
const { logger, encryptTools } = require("../../utils");

const setTokensInCookies = (res, accessToken, refreshToken) => {
	const isDevelopment = process.env.NODE_ENV === "development";
	const isProduction = process.env.NODE_ENV === "production";

	res.cookie("access_token", accessToken, {
		httpOnly: true, // Set httpOnly to true in production and to false in development
		secure: !isDevelopment, // Set secure to true in production and to false in development
		domain: ".neutroneer.com",
		sameSite: isDevelopment ? "Lax" : "None",
		path: "/",
		maxAge: 1000 * parseInt(process.env.ACCESS_TOKEN_EXPIRATION_SECONDS), // Cookie validity duration in milliseconds
	});

	res.cookie("refresh_token", refreshToken, {
		httpOnly: true, // Set httpOnly to true in production and to false in development
		secure: !isDevelopment, // Set secure to true in production and to false in development
		sameSite: isDevelopment ? "Lax" : "Strict",
		path: "/",
		maxAge: 1000 * parseInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS), // Cookie validity duration in milliseconds
	});
};

const storeRefreshTokenInDatabase = async (userId, refreshTokenToStore) => {
	try {
		// Convert id to ObjectId
		const ObjectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (ObjectIdUserId.status == "error") {
			return { status: "error", message: ObjectIdUserId.message };
		}

		// Check if a refresh token already exists for the user
		const existingToken = await RefreshToken.findOne({ user: ObjectIdUserId });

		// If an existing token is found, remove former token from the database
		if (existingToken) {
			await existingToken.deleteOne();
			logger.info(`Existing refresh token removed from database. userId: ${userId}`);
		}

		const refreshToken = new RefreshToken({
			user: ObjectIdUserId,
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
		// Convert id to ObjectId
		const ObjectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (ObjectIdUserId.status == "error") {
			return { status: "error", message: ObjectIdUserId.message };
		}

		// Check if a reset password token already exists for the user
		const existingToken = await ResetPasswordToken.find({ user: ObjectIdUserId });

		// If existing token(s) is(are) found, remove former token(s) from the database
		if (existingToken) {
			const deleteResult = await ResetPasswordToken.deleteMany({ user: ObjectIdUserId });

			if (deleteResult.deletedCount > 0) {
				logger.info(`Removed ${deleteResult.deletedCount} reset password token(s) from the database. userId: ${userId}`);
			}
		}
		const resetPasswordToken = new ResetPasswordToken({
			user: ObjectIdUserId,
			token: ResetPasswordTokenToStore,
		});

		await resetPasswordToken.save();

		logger.info(`Reset password token stored in database. ResetPasswordToken: ${resetPasswordToken}`);
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
