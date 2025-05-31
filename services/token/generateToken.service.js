const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../../utils");

function generateAccessToken(userId, expires = process.env.ACCESS_TOKEN_EXPIRATION) {
	const payload = {
		sub: userId,
	};
	const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expires });
	logger.info(`Access token generated: ${token}`);
	return token;
}

function generateAdminAccessToken(userId, expires = process.env.ACCESS_TOKEN_EXPIRATION) {
	const payload = {
		sub: userId,
	};
	const token = jwt.sign(payload, process.env.ACCESS_TOKEN_ADMIN_SECRET, { expiresIn: expires });
	logger.info(`Admin access token generated: ${token}`);
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
	const tokenUuid = uuidv4();
	const dataToEncrypt = { tokenUuid, userId };

	// Encrypt
	const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), process.env.RESET_PASSWORD_TOKEN_SECRET).toString();

	// Save raw encrypted token to DB
	// (return the encoded one for URL use)
	const resetPasswordToken = encodeURIComponent(encryptedData);

	logger.info(`reset password token generated (for URL): ${resetPasswordToken}`);
	return {
		rawToken: encryptedData, // rawToken to be saved in DB
		encodedToken: resetPasswordToken, // encodedToken to be used in the URL
	};
}

module.exports = {
	generateAccessToken,
	generateAdminAccessToken,
	generateRefreshToken,
	generateResetPasswordToken,
};
