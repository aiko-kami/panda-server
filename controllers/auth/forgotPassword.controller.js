const { userService, emailResetPasswordService, tokenService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		// Validate input data
		const validateEmail = validation.validateEmail(email);
		if (validateEmail.status !== "success") {
			return apiResponse.clientErrorResponse(res, validateEmail.message);
		}

		// Check if the user exists in the database using email
		const existingUser = await userService.retrieveUserByEmail(email);

		//In case of error, return a generic message to avoid email enumeration attack
		if (existingUser.status !== "success") {
			return apiResponse.successResponse(res, "Password reset email sent.");
		}

		// Generate a reset token and store it in the database
		const resetPasswordToken = tokenService.generateResetPasswordToken(existingUser.data.userId);

		const tokenStoredInDb = await tokenService.storeResetPasswordTokenInDatabase(
			existingUser.data.userId,
			resetPasswordToken
		);
		if (tokenStoredInDb.status !== "success") {
			return apiResponse.serverErrorResponse(res, tokenStoredInDb.message);
		}

		// Send reset password email to the user
		const emailSent = await emailResetPasswordService.sendPasswordResetEmail(
			existingUser.data.email,
			existingUser.data.username,
			resetPasswordToken
		);
		if (emailSent.status !== "success") {
			return apiResponse.serverErrorResponse(res, emailSent.message);
		}

		return apiResponse.successResponse(res, "Password reset email sent.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	forgotPassword,
};
