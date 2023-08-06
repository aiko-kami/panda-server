const { loginService, tokenService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

// Login user
const login = async (req, res) => {
	//identifier  is either the username or the email
	const { identifier, password } = req.body;

	try {
		// Validate input data
		const validateInputs = validation.validateLoginInputs(identifier, password);
		if (validateInputs.status !== "success") {
			return apiResponse.clientErrorResponse(res, validateInputs.message);
		}

		// Check if the user exists in the database by email or username
		const user = await loginService.getUserByUsernameOrEmail(identifier);
		if (user.status !== "success") {
			return apiResponse.clientErrorResponse(res, "Invalid login credentials.");
		}

		// Check if the user account is active
		if (!user.emailVerified.verified) {
			return apiResponse.clientErrorResponse(
				res,
				"Email not verified. Please verify your email address before logging in."
			);
		}

		// Check if the provided password matches the hashed password in the database
		const isPasswordValid = await loginService.comparePasswords(password, user.password);
		if (!isPasswordValid) {
			return apiResponse.clientErrorResponse(res, "Invalid login credentials.");
		}

		// Generate the access and refresh tokens
		const accessToken = tokenService.generateAccessToken(user.userId);
		const refreshToken = tokenService.generateRefreshToken(user.userId);

		tokenService.setTokensInCookies(res, accessToken, refreshToken);

		// Return the user data in the response
		return apiResponse.successResponseWithData(res, "User successfully logged in.", { user });

		// Catch error if occurred during login
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	login,
};
