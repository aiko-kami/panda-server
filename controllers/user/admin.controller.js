const { apiResponse, userValidation, authValidation, filterTools } = require("../../utils");
const { adminService } = require("../../services");

const retrieveMyUserData = async (req, res) => {
	try {
		const userId = req.userId;

		const userData = await adminService.retrieveUserById(userId, ["-_id", "username", "email", "createdAt", "profilePicture", "location", "description", "bio", "languages", "website"]);

		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		return apiResponse.successResponseWithData(res, userData.message, userData.user);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

/**
 * Update User Controller
 * This controller handles the update of user personal information.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated user or an error message.
 */
const updateUser = async (req, res) => {
	try {
		const userId = req.userId;

		//Retrieve and initialize user data
		const updatedUserInputs = {
			email: req.body.userNewData.email || "",
			profilePicture: req.body.userNewData.profilePicture || "",
			locationCountry: req.body.userNewData.locationCountry || "",
			locationCity: req.body.userNewData.locationCity || "",
			description: req.body.userNewData.description || "",
			bio: req.body.userNewData.bio || "",
			languages: req.body.userNewData.languages || [],
			website: req.body.userNewData.website || "",
		};

		// Validate input data for updating a user
		const validationResult = userValidation.validateUpdatedUserInputs(updatedUserInputs);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Filter on the fields that the user wants to update
		const filterUserInputs = filterTools.filterUserFieldsToUpdate(updatedUserInputs);

		//Verify that the email (if modified) is available
		if (filterUserInputs.email) {
			const emailVerification = await adminService.verifyEmailAvailability(filterUserInputs.email);
			if (emailVerification.status !== "success") {
				return apiResponse.serverErrorResponse(res, emailVerification.message);
			}
		}

		// Update the user in the database
		const updateUserResult = await adminService.updateUser(userId, filterUserInputs);

		// Check the result of the update operation
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

/**
 * Change User's password Controller
 * This controller handles the update of user's password.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated password status or an error message.
 */
const updateUserPassword = async (req, res) => {
	try {
		const userId = req.userId;

		const { oldPassword = "", newPassword = "", confirmNewPassword = "" } = req.body;

		// Validate input data
		const validationResult = authValidation.validatePasswordChange(oldPassword, newPassword, confirmNewPassword);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Update the user's password in the database
		const updatePasswordResult = await adminService.updateUserPassword(userId, newPassword);

		// Check the result of the update operation
		if (updatePasswordResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatePasswordResult.message);
		}

		return apiResponse.successResponse(res, updatePasswordResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	retrieveMyUserData,
	updateUser,
	updateUserPassword,
};
