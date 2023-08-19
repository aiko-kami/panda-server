const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { ResetPasswordToken } = require("../../models");

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

const verifyResetPasswordToken = async (resetToken) => {
	try {
		// Decrypt link
		const bytes = CryptoJS.AES.decrypt(
			decodeURIComponent(resetToken),
			process.env.RESET_PASSWORD_TOKEN_SECRET
		);
		const toDecrypt = bytes.toString(CryptoJS.enc.Utf8);

		if (!toDecrypt) {
			// Invalid or missing decrypted data
			throw new Error("Invalid Reset password token.");
		}

		var tokenData = JSON.parse(toDecrypt);

		if (!tokenData || !tokenData.tokenUuid || !tokenData.userId) {
			// Invalid or missing decrypted data
			throw new Error("Invalid Reset password token.");
		}

		const userIdDecrypted = tokenData.userId;

		const existingToken = await ResetPasswordToken.findOne({
			userId: userIdDecrypted,
			token: resetToken,
		});

		if (existingToken) {
			// Valid token found in the DB
			return {
				status: "success",
				message: "Reset password token is valid.",
				userId: existingToken.userId,
			};
		} else {
			// The token was not find in the DB
			return {
				status: "error",
				message: "Reset password token not found in the database.",
			};
		}
	} catch (error) {
		return {
			status: "error",
			message: "Invalid reset password token.",
		};
	}
};

module.exports = {
	verifyAccessToken,
	verifyRefreshToken,
	verifyResetPasswordToken,
};
