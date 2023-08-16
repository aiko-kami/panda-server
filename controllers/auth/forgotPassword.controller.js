const { userService, emailService, tokenService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

const forgotPassword = async (req, res) => {
	const { email } = req.body;

	try {
		// Validate input data
		const validateEmail = validation.validateEmail(email);
		if (validateEmail.status !== "success") {
			return apiResponse.clientErrorResponse(res, validateEmail.message);
		}

		// Check if the user exists in the database by email
		const existingUser = await userService.retrieveUserByEmail(email);
		if (existingUser.status !== "success") {
			return apiResponse.clientErrorResponse(res, "User not found.");
		}

		// Generate a reset token and store it in the database
		const resetToken = tokenService.generateResetToken(existingUser.data.userId);
		const tokenStoredInDb = await tokenService.storeResetTokenInDatabase(
			existingUser.data.userId,
			resetToken
		);
		if (tokenStoredInDb.status !== "success") {
			return apiResponse.serverErrorResponse(res, tokenStoredInDb.message);
		}

		// Send reset password email to the user
		const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);
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
