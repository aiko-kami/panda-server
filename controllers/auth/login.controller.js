const { loginService, generateTokenService, storeTokenService } = require("../../services");
const { apiResponse, authValidation } = require("../../utils");

// Login user
const login = async (req, res) => {
	try {
		//identifier is either the username or the email
		const { identifier = "", password = "" } = req.body;

		// Validate input data
		const validationResult = authValidation.validateLoginInputs(identifier, password);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Check if the user exists in the database by email or username
		const user = await loginService.retrieveUserByUsernameOrEmail(identifier);
		if (user.status !== "success") {
			return apiResponse.clientErrorResponse(res, "Invalid login credentials.");
		}

		// Check if the user account is active
		if (!user.emailVerified.verified) {
			return apiResponse.clientErrorResponse(res, "Email not verified. Please verify your email address before logging in.");
		}

		// Check if the provided password matches the hashed password in the database
		const isPasswordValid = await loginService.comparePasswords(password, user.password);
		if (!isPasswordValid) {
			return apiResponse.clientErrorResponse(res, "Invalid login credentials.");
		}

		// Generate the access and refresh tokens
		const accessToken = generateTokenService.generateAccessToken(user.userId);
		const refreshToken = generateTokenService.generateRefreshToken(user.userId);

		storeTokenService.setTokensInCookies(res, accessToken, refreshToken);

		const tokenStoredInDb = await storeTokenService.storeRefreshTokenInDatabase(user.userId, refreshToken);

		if (tokenStoredInDb.status !== "success") {
			return apiResponse.serverErrorResponse(res, tokenStoredInDb.message);
		}

		// Update User last connection to now
		const lastConnectionUpdated = await loginService.updateLastConnection(user.userId);
		if (!lastConnectionUpdated) {
			return apiResponse.serverErrorResponse(res, lastConnectionUpdated.message);
		}

		// Return the user data in the response
		return apiResponse.successResponseWithData(res, "User successfully logged in.", { user });

		// Catch error if occurred during login
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Login user
const adminLogin = async (req, res) => {
	try {
		//identifier is either the username or the email
		const { identifier = "", password = "" } = req.body;

		// Validate input data
		const validationResult = authValidation.validateLoginInputs(identifier, password);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Check if the user exists in the database by email or username
		const user = await loginService.retrieveAdminUserByUsernameOrEmail(identifier);
		if (user.status !== "success") {
			return apiResponse.clientErrorResponse(res, "Invalid login credentials.");
		}

		// Check if the provided password matches the hashed password in the database
		const isPasswordValid = await loginService.comparePasswords(password, user.password);
		if (!isPasswordValid) {
			return apiResponse.clientErrorResponse(res, "Invalid login credentials.");
		}

		// Generate the access and refresh tokens
		const accessToken = generateTokenService.generateAdminAccessToken(user.userId);
		const refreshToken = generateTokenService.generateRefreshToken(user.userId);

		storeTokenService.setTokensInCookies(res, accessToken, refreshToken);

		const tokenStoredInDb = await storeTokenService.storeRefreshTokenInDatabase(user.userId, refreshToken);

		if (tokenStoredInDb.status !== "success") {
			return apiResponse.serverErrorResponse(res, tokenStoredInDb.message);
		}

		// Update User last connection to now
		const lastConnectionUpdated = await loginService.updateAdminLastConnection(user.userId);
		if (!lastConnectionUpdated) {
			return apiResponse.serverErrorResponse(res, lastConnectionUpdated.message);
		}

		// Return the user data in the response
		return apiResponse.successResponseWithData(res, "Admin user successfully logged in.", { user });

		// Catch error if occurred during login
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	login,
	adminLogin,
};
