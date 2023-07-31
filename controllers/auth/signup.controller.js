const { userService, tokenService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

// Signup user
const signup = async (req, res) => {
	const { username, email, password, confirmPassword } = req.body;

	try {
		// Validate input data
		const validate = validation.validateRegistrationInputs(
			username,
			email,
			password,
			confirmPassword
		);
		if (validate.status !== 1) {
			return apiResponse.clientErrorResponse(res, validate.message);
		}

		// Check if the username already exists in the database
		const existingUsername = await userService.checkUsernameAvailability(username);
		if (existingUsername) {
			return apiResponse.clientErrorResponse(res, "Username is already in use.");
		}

		// Check if the email already exists in the database
		const existingEmail = await userService.checkEmailAvailability(email);
		if (existingEmail) {
			return apiResponse.clientErrorResponse(res, "Email is already in use.");
		}

		// Signup new user
		const newUser = await userService.signupUser(username, email, password);

		// Generate the access and refresh tokens
		const accessToken = tokenService.generateAccessToken(newUser._id);
		const refreshToken = tokenService.generateRefreshToken(newUser._id);

		// Send the access token and refresh token in the response
		return apiResponse.successResponseWithData(res, "User successfully signed.", {
			accessToken,
			refreshToken,
		});

		//catch error if occurred during signup
	} catch (error) {
		console.error("Error during signup:", error);
		return apiResponse.serverErrorResponse(res, "An error occurred during signup.");
	}
};

module.exports = {
	signup,
};
