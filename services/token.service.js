const jwt = require("jsonwebtoken");
const { DateTime } = require("luxon");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, secret = "MyBiGSecret00123777@") => {
	const payload = {
		sub: userId,
		iat: DateTime.now().ts,
		exp: expires,
	};
	return jwt.sign(payload, secret);
};

module.exports = {
	generateToken,
};
