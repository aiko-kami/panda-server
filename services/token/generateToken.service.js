const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const v4 = require("uuid").v4;
const { logger } = require("../../utils");

function generateAccessToken(userId, expires = process.env.ACCESS_TOKEN_EXPIRATION) {
	const payload = {
		sub: userId,
	};
	const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expires });
	logger.info(`Access token generated: ${token}`);
	return token;
}

function generateRefreshToken(userId, expires = process.env.REFRESH_TOKEN_EXPIRATION) {
	const payload = {
		sub: userId,
	};
	const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: expires });
	logger.info(`Refresh token generated: ${token}`);
	return token;
}

function generateResetPasswordToken(userId) {
	const tokenUuid = v4();
	const dataToEncrypt = { tokenUuid, userId };

	// Encrypt
	const encryptedData = CryptoJS.AES.encrypt(
		JSON.stringify(dataToEncrypt),
		process.env.RESET_PASSWORD_TOKEN_SECRET
	).toString();

	//Transform encrypted data into a valid token for URL
	const resetPasswordToken = encodeURIComponent(encryptedData);
	logger.info(`reset password token generated: ${resetPasswordToken}`);
	return resetPasswordToken;
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	generateResetPasswordToken,
};
