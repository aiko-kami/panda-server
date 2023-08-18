const { apiResponse } = require("../utils");
const { verifyTokenService } = require("../services");

const verifyAccessTokenForPrivateResourceMDW = (req, res, next) => {
	const accessToken = req.cookies.access_token;

	if (!accessToken) {
		return apiResponse.clientErrorResponse(res, "Access token is missing.");
	} else {
		try {
			const verifyResult = verifyTokenService.verifyAccessToken(accessToken);

			// Check if the token is valid and not expired
			if (verifyResult.status === "success") {
				// Token is valid, you can also extract user information from verifyResult.payload
				// Set user ID on request for future use if needed
				req.userId = verifyResult.payload.sub;

				// Proceed to the private resource
				next();
			} else {
				// Access token is invalid or expired
				return apiResponse.clientErrorResponse(res, "Invalid access token.");
			}
		} catch (error) {
			// Access token verification failed
			return apiResponse.serverErrorResponse(res, "Error verifying access token.");
		}
	}
};

module.exports = {
	verifyAccessTokenForPrivateResourceMDW,
};
