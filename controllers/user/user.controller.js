const { apiResponse, userValidation, authValidation, userTools } = require("../../utils");
const { userService } = require("../../services");

const retrieveMyUserData = async (req, res) => {
	try {
		const userId = req.userId;

		// Validate user ID
		const validationResult = userValidation.validateUserId(userId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const userData = await userService.retrieveUserById(userId, "-_id username email createdAt updatedAt location company description bio languages website profilePicture talents");
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		return apiResponse.successResponseWithData(res, userData.message, userData.user);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrieve 4 new users
const retrieveNewUsers = async (req, res) => {
	try {
		const newUsers = await userService.retrieveLatestUsers(4, "-_id username profilePicture description");
		if (newUsers.users !== null && newUsers.users.length > 0) {
			for (let user of newUsers.users) {
				// Filter on the public fields only
				user = userTools.filterOutputFields(user);
			}

			return apiResponse.successResponseWithData(res, newUsers.message, newUsers.users);
		} else {
			return apiResponse.serverErrorResponse(res, newUsers.message);
		}
	} catch (error) {
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
			company: req.body.userNewData.company || "",
			description: req.body.userNewData.description || "",
			bio: req.body.userNewData.bio || "",
			languages: req.body.userNewData.languages || [],
			website: req.body.userNewData.website || "",
		};

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data for updating a user
		const validationResult = userValidation.validateUpdatedUserInputs(updatedUserInputs);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Filter on the fields that the user wants to update
		const filterUserInputs = userTools.filterFieldsToUpdate(updatedUserInputs);

		//Verify that the email (if modified) is available
		if (filterUserInputs.email) {
			const emailVerification = await userService.verifyEmailAvailability(filterUserInputs.email);
			if (emailVerification.status !== "success") {
				return apiResponse.serverErrorResponse(res, emailVerification.message);
			}
		}

		// Update the user in the database
		const updateUserResult = await userService.updateUser(userId, filterUserInputs);
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

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data
		const validationResult = authValidation.validatePasswordChange(oldPassword, newPassword, confirmNewPassword);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Update the user's password in the database
		const updatePasswordResult = await userService.updateUserPassword(userId, oldPassword, newPassword);
		// Check the result of the update operation
		if (updatePasswordResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatePasswordResult.message);
		}

		return apiResponse.successResponse(res, updatePasswordResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveUserOverview = async (req, res) => {
	try {
		const { userId = "" } = req.params;

		// Validate user ID
		const validationResult = userValidation.validateUserId(userId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const userData = await userService.retrieveUserById(userId, "-_id username location description talents profilePicture");
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		// Filter on the public fields only
		const userDataFiltered = userTools.filterOutputFields(userData.user);

		return apiResponse.successResponseWithData(res, userData.message, userDataFiltered);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveUserPublicData = async (req, res) => {
	try {
		const { userId = "" } = req.params;

		// Validate user ID
		const validationResult = userValidation.validateUserId(userId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const userData = await userService.retrieveUserById(userId, "-_id username createdAt location company description bio languages website profilePicture");

		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		// Filter on the public fields only
		const userDataFiltered = userTools.filterOutputFields(userData.user);

		return apiResponse.successResponseWithData(res, userData.message, userDataFiltered);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	retrieveMyUserData,
	updateUser,
	retrieveNewUsers,
	updateUserPassword,
	retrieveUserOverview,
	retrieveUserPublicData,
};
