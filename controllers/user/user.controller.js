const { apiResponse, userValidation, authValidation, filterTools, uploadFiles } = require("../../utils");
const { userService, uploadService } = require("../../services");

const retrieveMyUserData = async (req, res) => {
	try {
		const userId = req.userId;

		// Validate user ID
		const validationResult = userValidation.validateUserId(userId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const userData = await userService.retrieveUserById(userId, [
			"username",
			"email",
			"createdAt",
			"updatedAt",
			"location",
			"company",
			"description",
			"bio",
			"languages",
			"website",
			"profilePicture",
			"talents",
			"notifications",
		]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		//Filter user data from user
		const userFiltered = filterTools.filterUserOutputFields(userData.user, userId);
		if (userFiltered.status !== "success") {
			return apiResponse.serverErrorResponse(res, userFiltered.message);
		}

		return apiResponse.successResponseWithData(res, userData.message, userFiltered);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrieve 4 new users
const retrieveNewUsers = async (req, res) => {
	try {
		const newUsers = await userService.retrieveLatestUsers(["username", "profilePicture", "description"], { "emailVerified.verified": true }, 4);
		if (newUsers.status !== "success") {
			return apiResponse.serverErrorResponse(res, newUsers.message);
		}

		if (newUsers.users === null || newUsers.users.length === 0) {
			return apiResponse.serverErrorResponse(res, newUsers.message);
		}

		//Filter users public data from users
		const userFiltered = filterTools.filterUsersOutputFields(newUsers.users, "unknown");
		if (userFiltered.status !== "success") {
			return apiResponse.serverErrorResponse(res, userFiltered.message);
		}
		return apiResponse.successResponseWithData(res, newUsers.message, userFiltered.users);
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
			locationCountry: req.body.userNewData.locationCountry || "",
			locationCity: req.body.userNewData.locationCity || "",
			company: req.body.userNewData.company || "",
			description: req.body.userNewData.description || "",
			bio: req.body.userNewData.bio || "",
			languages: req.body.userNewData.languages || [],
			website: req.body.userNewData.website || "",
		};

		//Retrieve and initialize user privacy data
		const updatedPrivacyInputs = {
			profilePicture: req.body.userPrivacyData.profilePicture || "",
			locationCountry: req.body.userPrivacyData.locationCountry || "",
			locationCity: req.body.userPrivacyData.locationCity || "",
			company: req.body.userPrivacyData.company || "",
			bio: req.body.userPrivacyData.bio || "",
			website: req.body.userPrivacyData.website || "",
			languages: req.body.userPrivacyData.languages || "",
			projectLike: req.body.userPrivacyData.projectLike || "",
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

		// Validate privacy data for updating a user
		const validationPrivacyResult = userValidation.validateUpdatedUserPrivacyInputs(updatedPrivacyInputs);
		if (validationPrivacyResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationPrivacyResult.message);
		}

		// Filter on the fields that the user wants to update
		const filterUserInputs = filterTools.filterUserFieldsToUpdate(updatedUserInputs);

		//Verify that the email (if modified) is available
		if (filterUserInputs.email) {
			const emailVerification = await userService.verifyEmailAvailability(filterUserInputs.email);
			if (emailVerification.status !== "success") {
				return apiResponse.serverErrorResponse(res, emailVerification.message);
			}
		}

		// Update the user in the database
		const updateUserResult = await userService.updateUser(userId, filterUserInputs);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		// Update user privacy in the database
		const updateUserPrivacyResult = await userService.updateUserPrivacy(userId, updatedPrivacyInputs);
		if (updateUserPrivacyResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserPrivacyResult.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateUserPicture = async (req, res) => {
	try {
		const userId = req.userId;

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Verify user exists, retrieve former profile picture
		const userData = await userService.retrieveUserById(userId, ["username", "profilePicture"]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		const formerProfilePicture = userData.user.profilePicture.key;
		const isFormerPicturePresent = formerProfilePicture !== "";

		//Verify that query contains an input file
		const inputFileCheckResult = uploadFiles.checkInputFile(req);
		if (inputFileCheckResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, inputFileCheckResult.message);
		}

		const isNewPicturePresent = inputFileCheckResult.isFile;

		// If new picture is present in the request, upload new profile picture to AWS
		if (isNewPicturePresent) {
			const uploadPictureResult = await uploadService.uploadProfilePicture(req, res, userId);
			if (uploadPictureResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, uploadPictureResult.message);
			}
		}

		// Remove former profile picture from AWS
		if (isFormerPicturePresent) {
			const deletePictureResult = await uploadFiles.deleteFile(formerProfilePicture);
			if (deletePictureResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, deletePictureResult.message);
			}
		}

		const profilePictureKey = req.file.key || "";
		const profilePictureLink = req.file.location || "";

		//Set new profile picture link in the data to update the database
		const updatedUserData = {
			profilePictureKey,
			profilePictureLink,
		};

		// Add new profile picture link to database (replace with new link or simply remove the former one if there is no new input)
		const updateUserResult = await userService.updateUser(userId, updatedUserData);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponseWithData(res, "User profile picture updated successfully.", profilePictureLink);
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

		const userData = await userService.retrieveUserById(userId, ["username", "location", "description", "talents", "profilePicture"]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		//Filter user public data from user
		const userFiltered = filterTools.filterUserOutputFields(userData.user, "unknown");
		if (userFiltered.status !== "success") {
			return apiResponse.serverErrorResponse(res, userFiltered.message);
		}
		return apiResponse.successResponseWithData(res, userData.message, userFiltered.user);
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

		const userData = await userService.retrieveUserById(userId, ["username", "createdAt", "location", "company", "description", "bio", "languages", "website", "profilePicture"]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		//Filter user public data from user
		const userFiltered = filterTools.filterUserOutputFields(userData.user, "unknown");
		if (userFiltered.status !== "success") {
			return apiResponse.serverErrorResponse(res, userFiltered.message);
		}
		return apiResponse.successResponseWithData(res, userData.message, userFiltered.user);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	retrieveMyUserData,
	retrieveNewUsers,
	updateUser,
	updateUserPicture,
	updateUserPassword,
	retrieveUserOverview,
	retrieveUserPublicData,
};
