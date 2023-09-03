const {
	userService,
	emailResetPasswordService,
	generateTokenService,
	storeTokenService,
	verifyTokenService,
	updateUserPasswordService,
	removeTokenService,
} = require("../../services");
const { apiResponse, authValidation } = require("../../utils");

/**
 * Handles the process of sending a password reset email to a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response object with success or error status and message.
 */

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		// Validate input data
		const validatedEmail = authValidation.validateEmail(email);
		if (validatedEmail.status !== "success") {
			return apiResponse.clientErrorResponse(res, validatedEmail.message);
		}

		// Check if the user exists in the database using email
		const existingUser = await userService.retrieveUserByEmail(email);

		//In case of error, return a generic message to avoid email enumeration attack
		if (existingUser.status !== "success") {
			return apiResponse.successResponse(res, "Password reset email sent.");
		}

		// Generate a reset token and store it in the database
		const resetPasswordToken = generateTokenService.generateResetPasswordToken(
			existingUser.data.userId
		);

		const tokenStoredInDb = await storeTokenService.storeResetPasswordTokenInDatabase(
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

const resetPassword = async (req, res) => {
	const { newPassword, confirmPassword, resetToken } = req.body;

	try {
		// Validate password and password confirmation input data
		const passwordValidation = authValidation.validatePassword(newPassword, confirmPassword);
		if (passwordValidation.status !== "success") {
			return apiResponse.clientErrorResponse(res, passwordValidation.message);
		}

		// Verify the reset token
		const tokenVerification = await verifyTokenService.verifyResetPasswordToken(resetToken);
		if (tokenVerification.status !== "success") {
			return apiResponse.clientErrorResponse(res, tokenVerification.message);
		}

		// Find the user by userId
		const existingUser = await userService.retrieveUserById(
			tokenVerification.userId,
			"email userId"
		);
		if (existingUser.status !== "success") {
			return apiResponse.clientErrorResponse(res, "User not found.");
		}

		// Update user's password
		const updatePasswordResult = await updateUserPasswordService.updateUserPassword(
			existingUser.data.userId,
			newPassword
		);

		if (updatePasswordResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatePasswordResult.message);
		}

		// Remove the used reset password token
		const removeTokenResult = await removeTokenService.removeResetPasswordTokenFromDatabase(
			existingUser.data.userId,
			resetToken
		);
		if (removeTokenResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeTokenResult.message);
		}

		return apiResponse.successResponse(res, "Password updated successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	forgotPassword,
	resetPassword,
};
