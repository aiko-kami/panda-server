const { AccessToken, RefreshToken } = require("../models");

const jwt = require("jsonwebtoken");
const { DateTime } = require("luxon");
const { logger } = require("../utils");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {string}
 */

function generateAccessToken(userId, expires = process.env.JWT_ACCESS_TOKEN_EXPIRATION) {
	const payload = {
		sub: userId,
	};
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expires });
}

function generateRefreshToken(userId, expires = process.env.JWT_REFRESH_TOKEN_EXPIRATION) {
	const payload = {
		sub: userId,
	};
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: expires });
}

const verifyAccessToken = (accessToken) => {
	try {
		const tokenDecoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
		// Check if the token is still valid (not expired)
		if (tokenDecoded.exp > Date.now() / 1000) {
			// Access token is valid
			return { status: "success", payload: tokenDecoded };
		} else {
			// Access token has expired
			return { status: "error", message: "Access token has expired." };
		}
	} catch (error) {
		// Access token verification failed
		return { status: "error", message: "Invalid access token." };
	}
};
const verifyRefreshToken = (refreshToken) => {
	try {
		const tokenDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

		// Check if the token is still valid (not expired)
		if (tokenDecoded.exp > Date.now() / 1000) {
			// Refresh token is valid
			return { status: "success", payload: tokenDecoded };
		} else {
			// Refresh token has expired
			return { status: "error", message: "Refresh token has expired." };
		}
	} catch (error) {
		// Refresh token verification failed
		return { status: "error", message: "Invalid refresh token." };
	}
};
const setTokensInCookies = (res, accessToken, refreshToken) => {
	res.cookie("access_token", accessToken, {
		httpOnly: true,
		secure: true,
		maxAge: 1000 * parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_SECONDS), // Cookie validity duration in milliseconds
	});

	res.cookie("refresh_token", refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: 1000 * parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_SECONDS), // Cookie validity duration in milliseconds
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

const deleteAllTokens = async () => {
	try {
		const deletedAccessTokens = await AccessToken.deleteMany({});
		const deletedRefreshTokens = await RefreshToken.deleteMany({});

		logger.info(
			`Deleted ${deletedAccessTokens.deletedCount} access tokens and ${deletedRefreshTokens.deletedCount} refresh tokens.`
		);
		return {
			status: "success",
			message: `Deleted ${deletedAccessTokens.deletedCount} access tokens and ${deletedRefreshTokens.deletedCount} refresh tokens.`,
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
	console.log("🚀 ~ removeRefreshTokenFromDatabase ~ refreshToken:", refreshToken);

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
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	setTokensInCookies,
	storeRefreshTokenInDatabase,
	deleteAllTokens,
	removeRefreshTokenFromDatabase,
};
