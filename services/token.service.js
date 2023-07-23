const jwt = require("jsonwebtoken");
const { DateTime } = require("luxon");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {string}
 */
const generateToken = (userId, expires) => {
	const payload = {
		sub: userId,
		iat: DateTime.now().ts,
	};
	console.log(payload);
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires });
};

const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET, true);
};

module.exports = {
	generateToken,
	verifyToken,
};
