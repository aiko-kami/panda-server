const { userService, tokenService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

// Login user
const login = async (req, res) => {
	const { identifier, password } = req.body;

	try {
		// Validate input data
		const validateInputs = validation.validateLoginInputs(identifier, password);
		if (validateInputs.status !== "success") {
			return apiResponse.clientErrorResponse(res, validateInputs.message);
		}

		// Check if the user exists in the database by email or username
		const user = await userService.getUserByIdentifier(identifier);
		if (!user) {
			return apiResponse.clientErrorResponse(res, "User not found.");
		}

		// Check if the provided password matches the hashed password in the database
		const isPasswordMatch = await userService.comparePasswords(password, user.password);
		if (!isPasswordMatch) {
			return apiResponse.clientErrorResponse(res, "Invalid password.");
		}

		// Generate the access and refresh tokens
		const accessToken = tokenService.generateAccessToken(user.userId);
		const refreshToken = tokenService.generateRefreshToken(user.userId);

		// Return the access token and refresh token in the response
		return apiResponse.successResponseWithData(res, "User successfully logged in.", {
			accessToken,
			refreshToken,
		});

		// Catch error if occurred during login
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}

	const token = tokenService.generateToken(
		4,
		parseInt(process.env.JWT_ACCESS_LOGIN_EXPIRATION_MINUTES)
	);
	return apiResponse.successResponseWithData(res, "Operation success", { token });
};

module.exports = {
	login,
};
