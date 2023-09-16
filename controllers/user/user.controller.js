const { apiResponse, userValidation } = require("../../utils");
const { userService } = require("../../services");

const retrieveMyUserData = async (req, res) => {
	try {
		const userId = req.userId;

		userService
			.retrieveUserById(
				userId,
				"-_id username email createdAt location company description bio languages website profilePicture"
			)
			.then((user) => {
				// Send response with my user data
				return apiResponse.successResponseWithData(res, "User data retrieved successfully.", user);
			});
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrieve 4 new users
const retrieveNewUsers = async (req, res) => {
	try {
		const newUsers = await userService.retrieveNewUsers(4, "username profilePicture description");

		if (newUsers.users !== null && newUsers.users.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				"New users retrieved successfully.",
				newUsers.users
			);
		} else {
			return apiResponse.successResponse(res, newUsers.message);
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
		const userId = req.params.userId;
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

		// Validate input data for updating a user
		const validationResult = userValidation.validateUpdatedUserInputs(updatedUserInputs);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Filter on the fields that the user wants to update
		const filterUserInputs = projectTools.filterFieldsToUpdate(updatedProjectInputs);

		const filterUserInputsArray = Object.keys(filterUserInputs);

		// Update the user in the database
		const updateUserResult = await userService.updateUser(userId, filterUserInputsArray);

		// Check the result of the update operation
		if (updateUserResult.status === "success") {
			return apiResponse.successResponse(res, updateUserResult.message);
		} else {
			return apiResponse.errorResponse(res, updateUserResult.message);
		}
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	retrieveMyUserData,
	updateUser,
	retrieveNewUsers,
};
