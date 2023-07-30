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

function generateRefreshToken(userId, expires = "7d") {
	const payload = {
		sub: userId,
		iat: DateTime.now().ts,
	};

	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: expires });
}

const generateToken = (userId, expires) => {
	const payload = {
		sub: userId,
		iat: DateTime.now().ts,
	};
	console.log(payload);
	return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: expires });
};

const verifyAccessToken = (accessToken) => {
	return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, true);
};

const verifyRefreshToken = (refreshToken) => {
	return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, true);
};

module.exports = {
	generateToken,
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
};
