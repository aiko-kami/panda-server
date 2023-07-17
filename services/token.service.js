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
	};
	console.log(payload);
	return jwt.sign(payload, secret, { expiresIn: expires });
};

const verifyToken = (token) => {
	return jwt.verify(token, "MyBiGSecret00123777@");
};

module.exports = {
	generateToken,
	verifyToken,
};
