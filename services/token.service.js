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
		iat: DateTime.now().ts,
	};

	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expires });
}

const verifyAccessToken = (accessToken) => {
	return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, true);
};

function generateRefreshToken(userId, expires = process.env.JWT_REFRESH_TOKEN_EXPIRATION) {
	const payload = {
		sub: userId,
		iat: DateTime.now().ts,
	};

	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: expires });
}

const verifyRefreshToken = (refreshToken) => {
	return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, true);
};

const generateToken = (userId, expires) => {
	const payload = {
		sub: userId,
		iat: DateTime.now().ts,
	};
	return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: expires });
};

const setTokensInCookies = (res, accessToken, refreshToken) => {
	res.cookie("access_token", accessToken, {
		httpOnly: true,
		secure: true,
		maxAge: 1000 * 60 * 60, // Cookie validity duration in milliseconds (1 hour)
	});

	res.cookie("refresh_token", refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie validity duration in milliseconds (7 days)
	});
};

const storeTokensInDatabase = async (userId, accessTokenToStore, refreshTokenToStore) => {
	try {
		const accessToken = new AccessToken({
			userId: userId,
			token: accessTokenToStore,
		});

		const refreshToken = new RefreshToken({
			userId: userId,
			token: refreshTokenToStore,
		});

		await accessToken.save();
		await refreshToken.save();

		logger.info(
			`Tokens stored in database. accessToken: ${accessToken} - refreshToken: ${refreshToken}`
		);
		return {
			status: "success",
			message: "Tokens stored in database.",
			data: { accessToken, refreshToken },
		};
	} catch (error) {
		logger.error("Error while storing tokens in database: ", error);
		return { status: "error", message: "An error occurred while storing tokens in database." };
	}
};

module.exports = {
	generateToken,
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	setTokensInCookies,
	storeTokensInDatabase,
};
