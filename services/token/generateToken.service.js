const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const v4 = require("uuid").v4;

function generateAccessToken(userId, expires = process.env.ACCESS_TOKEN_EXPIRATION) {
	const payload = {
		sub: userId,
	};
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expires });
}

function generateRefreshToken(userId, expires = process.env.REFRESH_TOKEN_EXPIRATION) {
	const payload = {
		sub: userId,
	};
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: expires });
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

	return resetPasswordToken;
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	generateResetPasswordToken,
};
