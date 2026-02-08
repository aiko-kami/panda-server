const { apiResponse } = require("../utils");
const { verifyTokenService } = require("../services");

const verifyAccess = (req, res, next) => {
	const accessToken = req.cookies.access_token;
	if (!accessToken) {
		return apiResponse.unauthorizedResponse(res, "Access denied.");
	} else {
		try {
			const verifyResult = verifyTokenService.verifyAccessToken(accessToken);

			// Check if the token is valid and not expired
			if (verifyResult.status === "success") {
				// If token is valid, set user ID on request for future use if needed
				req.userId = verifyResult.payload.sub;

				// Proceed to the private resource
				next();
			} else {
				// Access token is invalid or expired
				return apiResponse.unauthorizedResponse(res, "Access denied.");
			}
		} catch (error) {
			// Access token verification failed
			return apiResponse.serverErrorResponse(res, "Error verifying access token.");
		}
	}
};

const verifyAdminAccess = (req, res, next) => {
	const accessToken = req.cookies.access_token;
	if (!accessToken) {
		return apiResponse.unauthorizedResponse(res, "Access denied.");
	} else {
		try {
			const verifyResult = verifyTokenService.verifyAdminAccessToken(accessToken);
			// Check if the token is valid and not expired
			if (verifyResult.status === "success") {
				// If token is valid, set user ID on request for future use if needed
				req.userId = verifyResult.payload.sub;

				// Proceed to the private resource
				next();
			} else {
				// Access token is invalid or expired
				return apiResponse.unauthorizedResponse(res, "Access denied.");
			}
		} catch (error) {
			// Access token verification failed
			return apiResponse.serverErrorResponse(res, "Error verifying access token.");
		}
	}
};

const verifyUserPresence = (req, res, next) => {
	const accessToken = req.cookies.access_token;

	if (!accessToken) {
		req.userId = "unknown";
		next();
	} else {
		try {
			const verifyResult = verifyTokenService.verifyAccessToken(accessToken);

			// Check if the token is valid and not expired
			if (verifyResult.status === "success") {
				// If token is valid, set user ID on request for future use if needed
				req.userId = verifyResult.payload.sub;

				// Proceed to the resource
				next();
			} else {
				// Access token is invalid or expired
				req.userId = "unknown";
				next();
			}
		} catch (error) {
			// Access token verification failed
			req.userId = "unknown";
			next();
		}
	}
};

module.exports = {
	verifyAccess,
	verifyAdminAccess,
	verifyUserPresence,
};
