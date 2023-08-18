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

module.exports = {
	verifyAccessToken,
	verifyRefreshToken,
};
