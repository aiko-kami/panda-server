const {
	userService,
	emailResetPasswordService,
	generateTokenService,
	storeTokenService,
	verifyTokenService,
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
	try {
		const { email = "" } = req.body;

		// Validate input data
		const validatedEmail = authValidation.validateEmail(email);
		if (validatedEmail.status !== "success") {
			return apiResponse.clientErrorResponse(res, validatedEmail.message);
		}

		// Check if the user exists in the database using email
		const existingUser = await userService.retrieveUserByEmail(email, "-_id email userId username");

		//In case of error, return a generic message to avoid email enumeration attack
		if (existingUser.status !== "success") {
			return apiResponse.successResponse(res, "Password reset email sent.");
		}

		// Generate a reset token and store it in the database
		const resetPasswordToken = generateTokenService.generateResetPasswordToken(
			existingUser.user.userId
		);

		const tokenStoredInDb = await storeTokenService.storeResetPasswordTokenInDatabase(
			existingUser.user.userId,
			resetPasswordToken
		);
		if (tokenStoredInDb.status !== "success") {
			return apiResponse.serverErrorResponse(res, tokenStoredInDb.message);
		}

		// Send reset password email to the user
		const emailSent = await emailResetPasswordService.sendPasswordResetEmail(
			existingUser.user.email,
			existingUser.user.username,
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
	try {
		const { newPassword = "", confirmPassword = "", resetToken = "" } = req.body;

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
			"-_id email userId"
		);

		if (existingUser.status !== "success") {
			return apiResponse.clientErrorResponse(res, "User not found.");
		}

		// Update user's password
		const updatePasswordResult = await userService.updateUserPassword(
			existingUser.user.userId,
			newPassword
		);

		if (updatePasswordResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatePasswordResult.message);
		}

		// Remove the used reset password token
		const removeTokenResult = await removeTokenService.removeResetPasswordTokenFromDatabase(
			existingUser.user.userId,
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
