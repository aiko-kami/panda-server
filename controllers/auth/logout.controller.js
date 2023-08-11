const { tokenService } = require("../../services");
const { apiResponse } = require("../../utils");

// Logout user
const logout = async (req, res) => {
	try {
		// Get the user ID from the request (assuming it was added to the request during authentication)
		const refreshToken = req.cookies.refresh_token;

		// Remove the refresh token from the database
		const removeRefreshTokenResult = await tokenService.removeRefreshTokenFromDatabase(
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
