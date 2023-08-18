const { removeTokenService } = require("../../services");
const { apiResponse } = require("../../utils");

// Logout user
const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refresh_token;

		// Remove the refresh token from the database
		const removeRefreshTokenResult = await removeTokenService.removeRefreshTokenFromDatabase(
			refreshToken
		);
		if (removeRefreshTokenResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeRefreshTokenResult.message);
		}

		// Clear the access and refresh tokens from cookies
		res.clearCookie("access_token");
		res.clearCookie("refresh_token");

		return apiResponse.successResponse(res, "User successfully logged out.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while logging out.");
	}
};

module.exports = {
	logout,
};
