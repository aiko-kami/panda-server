const jwt = require("jsonwebtoken");
const { DateTime } = require("luxon");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {string}
 */

function generateAccessToken(userId, expires = "1h") {
	const payload = {
		sub: userId,
		iat: DateTime.now().ts,
	};

	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expires });
}

const verifyAccessToken = (accessToken) => {
	return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, true);
};

function generateRefreshToken(userId, expires = "7d") {
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
	console.log(payload);
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

module.exports = {
	generateToken,
	generateAccessToken,
	generateRefreshToken,
	setTokensInCookies,
	verifyAccessToken,
	verifyRefreshToken,
};
