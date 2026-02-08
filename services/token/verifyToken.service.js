const { ResetPasswordToken } = require("../../models");
const { encryptTools } = require("../../utils");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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
		return { status: "error", message: error.message };
	}
};

const verifyAdminAccessToken = (accessToken) => {
	console.log("🚀 ~ verifyAdminAccessToken ~ accessToken:", accessToken);

	try {
		const tokenDecoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_ADMIN_SECRET);

		console.log("🚀 ~ verifyAdminAccessToken ~ tokenDecoded:", tokenDecoded);

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
		return { status: "error", message: error.message };
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
		return { status: "error", message: error.message };
	}
};

const verifyResetPasswordToken = async (resetToken) => {
	try {
		// Decode the token
		const decodedToken = decodeURIComponent(resetToken);

		// Decrypt link
		const bytes = CryptoJS.AES.decrypt(decodedToken, process.env.RESET_PASSWORD_TOKEN_SECRET);
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

		// Convert id to ObjectId
		const ObjectIdUserId = encryptTools.convertIdToObjectId(userIdDecrypted);

		if (ObjectIdUserId.status == "error") {
			return { status: "error", message: ObjectIdUserId.message };
		}

		const existingToken = await ResetPasswordToken.findOne({
			user: ObjectIdUserId,
			token: decodedToken,
		});

		if (existingToken) {
			// Valid token found in the database
			return {
				status: "success",
				message: "Reset password token is valid.",
				userId: userIdDecrypted,
			};
		} else {
			// The token was not find in the database
			return {
				status: "error",
				message: "Reset password token not found in the database.",
			};
		}
	} catch (error) {
		return {
			status: "error",
			message: error.message,
		};
	}
};

module.exports = {
	verifyAccessToken,
	verifyAdminAccessToken,
	verifyRefreshToken,
	verifyResetPasswordToken,
};
