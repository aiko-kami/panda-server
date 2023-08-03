const { userService, emailValidationService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

// Signup user
const signup = async (req, res) => {
	const { username, email, password, confirmPassword } = req.body;

	try {
		// Validate input data
		const validateInputs = validation.validateRegistrationInputs(
			username,
			email,
			password,
			confirmPassword
		);
		if (validateInputs.status !== "success") {
			return apiResponse.clientErrorResponse(res, validateInputs.message);
		}

		// Check if the username or the email already exist in the database
		const existingUsernameOrEmail = await userService.checkUsernameAndEmailAvailability(
			username,
			email
		);
		if (existingUsernameOrEmail) {
			return apiResponse.serverErrorResponse(res, existingUsernameOrEmail.message);
		}

		// Signup new user
		const newUserCreated = await userService.signupUser(username, email, password);
		if (newUserCreated.status !== "success") {
			return apiResponse.serverErrorResponse(res, newUserCreated.message);
		}

		//Send vaildation email to confirm email address
		const validationEmailSent = await emailValidationService.sendVerificationEmail(
			newUserCreated.data.userId
		);
		if (validationEmailSent.status !== "success") {
			return apiResponse.serverErrorResponse(res, validationEmailSent.message);
		}

		return apiResponse.successResponse(
			res,
			"New user successfully signed up and validation email sent."
		);

		//catch error if occurred during signup
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Verify the email address via the personalized link sent to the user
const verifyEmailLink = async (req, res) => {
	const emailValidationId = req.params.emailValidationId;

	try {
		const emailVerified = await emailValidationService.verifyEmailValidationId(emailValidationId);
		if (emailVerified.status !== "success") {
			return apiResponse.serverErrorResponse(res, emailVerified.message);
		}
		return apiResponse.successResponse(res, emailVerified.message);
		//catch error if occurred during email verification link
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	signup,
	verifyEmailLink,
};
