const { apiResponse, userValidation, authValidation, filterTools, uploadFiles } = require("../../utils");
const { userService, projectService, joinProjectService, uploadService, emailService } = require("../../services");

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
			"userId",
			"email",
			"createdAt",
			"updatedAt",
			"location",
			"company",
			"description",
			"bio",
			"languages",
			"website",
			"talents",
			"quickSkills",
			"profilePicture",
			"backgroundPicture",
			"talents",
			"notifications",
			"settings",
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

const retrieveMyUserSettings = async (req, res) => {
	try {
		const userId = req.userId;

		// Validate user ID
		const validationResult = userValidation.validateUserId(userId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const userData = await userService.retrieveUserById(userId, ["profilePicture", "backgroundPicture", "bio", "location", "company", "languages", "website", "projectLikePrivacy", "settings"]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		const user = userData.user;

		//Filter user data from user
		const privacyFiltered = filterTools.filterUserPrivacyFields(user, userId);
		if (privacyFiltered.status !== "success") {
			return apiResponse.serverErrorResponse(res, privacyFiltered.message);
		}

		if (!user.settings) {
			return apiResponse.serverErrorResponse(res, "User settings not found.");
		}
		const responseSettings = {
			privacySettings: privacyFiltered.privacySettings,
			displayMode: user.settings.displayMode,
			appearance: user.settings.appearance,
			language: user.settings.language,
			notifications: {
				notificationsNewsletter: user.settings.communicationNotifications.newsletter,
				notificationsProjects: user.settings.communicationNotifications.projects,
				notificationsMessages: user.settings.communicationNotifications.messages,
				notificationsComments: user.settings.communicationNotifications.comments,
			},
		};

		return apiResponse.successResponseWithData(res, "User settings retrieved successfully.", {
			userId,
			userSettings: responseSettings,
		});
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveMyUserPrivacySettings = async (req, res) => {
	try {
		const userId = req.userId;

		// Validate user ID
		const validationResult = userValidation.validateUserId(userId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const userData = await userService.retrieveUserById(userId, ["profilePicture", "backgroundPicture", "bio", "location", "company", "languages", "website", "projectLikePrivacy"]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		//Filter user data from user
		const userFiltered = filterTools.filterUserPrivacyFields(userData.user, userId);
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
		return apiResponse.successResponseWithData(res, userData.message, { user: userFiltered.user });
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

		// Retrieve user data from database
		const userData = await userService.retrieveUserById(userId, [
			"username",
			"createdAt",
			"location",
			"company",
			"description",
			"bio",
			"languages",
			"website",
			"profilePicture",
			"backgroundPicture",
			"talents",
			"quickSkills",
			"projectLikePrivacy",
		]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		// Retrieve user projects
		const userProjectsData = await projectService.retrieveProjectsFromUser(
			userId,
			["-_id", "projectId", "link", "title", "summary", "cover", "category", "subCategory", "tags"],
			["created", "onGoing", "completed", "like"],
			"public",
		);

		if (userProjectsData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userProjectsData.message);
		}

		//Filter user public data from user
		const userFiltered = filterTools.filterUserOutputFields(userData.user, "unknown");
		if (userFiltered.projectLikePrivacy == "success") {
			return apiResponse.serverErrorResponse(res, userFiltered.message);
		}

		//Filter projects if user like is private
		if (userFiltered.user.projectLikePrivacy !== "public") {
			delete userProjectsData.projects.like;
			delete userProjectsData.projectsCount.like;
		}

		return apiResponse.successResponseWithData(res, userData.message, { user: userFiltered.user, projects: userProjectsData.projects, projectsCount: userProjectsData.projectsCount });
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveUserPrivateProjects = async (req, res) => {
	try {
		const userId = req.userId;

		// Validate user ID
		const validationResult = userValidation.validateUserId(userId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve user data from database
		const userData = await userService.retrieveUserById(userId, ["settings", "notifications"]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		//Filter user public data from user
		const userFiltered = filterTools.filterUserOutputFields(userData.user, userId);
		if (userFiltered.projectLikePrivacy == "success") {
			return apiResponse.serverErrorResponse(res, userFiltered.message);
		}

		// Retrieve user projects
		const userProjectsData = await projectService.retrieveProjectsFromUser(
			userId,
			["-_id", "projectId", "link", "title", "summary", "cover", "category", "subCategory", "statusInfo", "likes", "tags"],
			["created", "onGoing", "like"],
			"private",
		);
		if (userProjectsData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userProjectsData.message);
		}

		// Retrieve user's join project invitations
		const joinProjectInvitationsResult = await joinProjectService.retrieveMyJoinProjects(userId, "join project invitation", "all");
		if (joinProjectInvitationsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectInvitationsResult.message);
		}

		// Retrieve user's join project requests
		const joinProjectRequestsResult = await joinProjectService.retrieveMyJoinProjects(userId, "join project request", "all");
		if (joinProjectRequestsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectRequestsResult.message);
		}

		return apiResponse.successResponseWithData(res, userProjectsData.message, {
			user: userFiltered.user,
			projects: userProjectsData.projects,
			projectsCount: userProjectsData.projectsCount,
			joinProjectInvitations: joinProjectInvitationsResult.joinProjects,
			joinProjectRequests: joinProjectRequestsResult.joinProjects,
		});
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

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
		const validationResult = userValidation.validateUserInputs(updatedUserInputs);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Validate privacy data for updating a user
		const validationPrivacyResult = userValidation.validateUserPrivacyInputs(updatedPrivacyInputs);
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

const updateUserBioDescription = async (req, res) => {
	try {
		const userId = req.userId;

		//Retrieve and initialize user data
		const updatedUserInputs = {
			description: req.body.userNewData.description || "",
			bio: req.body.userNewData.bio || "",
		};

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data for updating a user
		const validationResult = userValidation.validateUserBioDescription(updatedUserInputs);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Filter on the fields that the user wants to update
		const filterUserInputs = filterTools.filterUserFieldsToUpdate(updatedUserInputs);

		// Update the user in the database
		const updateUserResult = await userService.updateUser(userId, filterUserInputs);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateUserDetails = async (req, res) => {
	try {
		const userId = req.userId;

		//Retrieve and initialize user data
		const updatedUserInputs = {
			locationCountry: req.body.userNewData.locationCountry || "",
			locationCity: req.body.userNewData.locationCity || "",
			company: req.body.userNewData.company || "",
			languages: req.body.userNewData.languages || [],
			website: req.body.userNewData.website || "",
		};

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data for updating a user
		const validationResult = userValidation.validateUserDetails(updatedUserInputs);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Filter on the fields that the user wants to update
		const filterUserInputs = filterTools.filterUserFieldsToUpdate(updatedUserInputs);

		// Update the user in the database
		const updateUserResult = await userService.updateUser(userId, filterUserInputs);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateUserSettingsPrivacy = async (req, res) => {
	try {
		const userId = req.userId;

		//Retrieve and initialize user privacy data
		const updatedPrivacyInputs = {
			profilePicture: req.body.userNewData.privacyProfilePicture || "",
			backgroundPicture: req.body.userNewData.privacyBackgroundPicture || "",
			bio: req.body.userNewData.privacyBio || "",
			locationCity: req.body.userNewData.privacyLocationCity || "",
			locationCountry: req.body.userNewData.privacyLocationCountry || "",
			company: req.body.userNewData.privacyCompany || "",
			languages: req.body.userNewData.privacyLanguages || "",
			website: req.body.userNewData.privacyWebsite || "",
			projectLike: req.body.userNewData.privacyProjectLike || "",
		};

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data for updating a user
		const validationPrivacyResult = userValidation.validateUserPrivacyInputs(updatedPrivacyInputs);
		if (validationPrivacyResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationPrivacyResult.message);
		}

		// Update user privacy in the database
		const updateUserResult = await userService.updateUserPrivacy(userId, updatedPrivacyInputs);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateUserSettingsAppearance = async (req, res) => {
	try {
		const userId = req.userId;

		const updatedSettingsInputs = {
			appearance: req.body.userNewData.appearance || "",
		};

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data for updating a user
		const validationWebsiteSettingsResult = userValidation.validateAppearanceSettingsInputs(updatedSettingsInputs);
		if (validationWebsiteSettingsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationWebsiteSettingsResult.message);
		}

		// Update the user appearamce settings in the database
		const updateUserResult = await userService.updateUser(userId, updatedSettingsInputs);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateUserSettingsDisplayMode = async (req, res) => {
	try {
		const userId = req.userId;

		const updatedDisplayModeInputs = {
			displayMode: req.body.userNewData?.displayMode || "",
		};

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data for updating a user
		const validationWebsiteSettingsResult = userValidation.validateDisplayModeSettingsInputs(updatedDisplayModeInputs);
		if (validationWebsiteSettingsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationWebsiteSettingsResult.message);
		}

		// Update the user appearamce settings in the database
		const updateUserResult = await userService.updateUser(userId, updatedDisplayModeInputs);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateUserSettingsLanguage = async (req, res) => {
	try {
		const userId = req.userId;

		const updatedLanguageInputs = {
			language: req.body.userNewData.language || "",
		};

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data for updating a user
		const validationWebsiteSettingsResult = userValidation.validateLanguageSettingsInputs(updatedLanguageInputs);
		if (validationWebsiteSettingsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationWebsiteSettingsResult.message);
		}

		// Update the user language settings in the database
		const updateUserResult = await userService.updateUser(userId, updatedLanguageInputs);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateUserSettingsNotifications = async (req, res) => {
	try {
		const userId = req.userId;

		//Retrieve and initialize user privacy data

		const updatedNotificationsInputs = {
			notificationsNewsletter: req.body.userNewData.notificationsNewsletter ?? "",
			notificationsProjects: req.body.userNewData.notificationsProjects ?? "",
			notificationsMessages: req.body.userNewData.notificationsMessages ?? "",
			notificationsComments: req.body.userNewData.notificationsComments ?? "",
		};

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data for updating a user
		const validationNotificationsResult = userValidation.validateNotificationsInputs(updatedNotificationsInputs);
		if (validationNotificationsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationNotificationsResult.message);
		}

		// Update the user notifications settings in the database
		const updateUserResult = await userService.updateUser(userId, updatedNotificationsInputs);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateUserEmail = async (req, res) => {
	try {
		const userId = req.userId;

		//Retrieve and initialize user data
		const newEmail = req.body.userNewData.email || "";

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Validate input data for updating a user
		const validationResult = authValidation.validateEmail(newEmail);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		//Verify that the email is available
		const emailVerification = await userService.verifyEmailAvailability(newEmail);
		if (emailVerification.status !== "success") {
			return apiResponse.serverErrorResponse(res, emailVerification.message);
		}

		// Update the user in the database
		const updateUserResult = await userService.updateUserEmail(userId, newEmail);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		//Send validation email to confirm new email address
		const validationEmailSent = await emailService.sendVerificationEmailChangeEmail(userId);
		if (validationEmailSent.status !== "success") {
			return apiResponse.serverErrorResponse(res, validationEmailSent.message);
		}

		return apiResponse.successResponse(res, updateUserResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateUserPassword = async (req, res) => {
	try {
		const userId = req.userId;

		//Retrieve and initialize user data
		const { oldPassword = "", newPassword = "", confirmNewPassword = "" } = req.body.userNewData;

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

const updateUserBackgroundPicture = async (req, res) => {
	try {
		const userId = req.userId;

		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Verify user exists, retrieve former background picture
		const userData = await userService.retrieveUserById(userId, ["username", "backgroundPicture"]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		const formerBackgroundPicture = userData.user.backgroundPicture.key;
		const isFormerBackgroundPicturePresent = formerBackgroundPicture !== "";

		//Verify that query contains an input file
		const inputFileCheckResult = uploadFiles.checkInputFile(req);
		if (inputFileCheckResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, inputFileCheckResult.message);
		}

		const isNewBackgroundPicturePresent = inputFileCheckResult.isFile;

		// If new picture is present in the request, upload new background picture to AWS
		if (isNewBackgroundPicturePresent) {
			const uploadPictureResult = await uploadService.uploadBackgroundPicture(req, res, userId);
			if (uploadPictureResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, uploadPictureResult.message);
			}
		}

		// Remove former background picture from AWS
		if (isFormerBackgroundPicturePresent) {
			const deleteBackgroundPictureResult = await uploadFiles.deleteFile(formerBackgroundPicture);
			if (deleteBackgroundPictureResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, deleteBackgroundPictureResult.message);
			}
		}

		const backgroundPictureKey = req.file.key || "";
		const backgroundPictureLink = req.file.location || "";

		//Set new background picture link in the data to update the database
		const updatedUserData = {
			backgroundPictureKey,
			backgroundPictureLink,
		};

		// Add new background picture link to database (replace with new link or simply remove the former one if there is no new input)
		const updateUserResult = await userService.updateUser(userId, updatedUserData);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponseWithData(res, "User background picture updated successfully.", backgroundPictureLink);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeUserPicture = async (req, res) => {
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

		// Remove former profile picture from AWS
		if (isFormerPicturePresent) {
			const deletePictureResult = await uploadFiles.deleteFile(formerProfilePicture);
			if (deletePictureResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, deletePictureResult.message);
			}
		}

		//Set empty profile picture data to update the database
		const updatedUserData = {
			profilePictureKey: "",
			profilePictureLink: "",
		};

		// Update profile picture with empty data in database (remove the former picture)
		const updateUserResult = await userService.updateUser(userId, updatedUserData);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, "User profile picture removed successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeUserBackgroundPicture = async (req, res) => {
	try {
		const userId = req.userId;
		// Validate user ID
		const idValidationResult = userValidation.validateUserId(userId);
		if (idValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, idValidationResult.message);
		}

		// Verify user exists, retrieve former background picture
		const userData = await userService.retrieveUserById(userId, ["username", "backgroundPicture"]);
		if (userData.status !== "success") {
			return apiResponse.serverErrorResponse(res, userData.message);
		}

		const formerBackgroundPicture = userData.user.backgroundPicture.key;
		const isFormerBackgroundPicturePresent = formerBackgroundPicture !== "";

		// Remove former background picture from AWS
		if (isFormerBackgroundPicturePresent) {
			const deleteBackgroundPictureResult = await uploadFiles.deleteFile(formerBackgroundPicture);
			if (deleteBackgroundPictureResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, deleteBackgroundPictureResult.message);
			}
		}

		//Set empty background picture data to update the database
		const updatedUserData = {
			backgroundPictureKey: "",
			backgroundPictureLink: "",
		};
		// Update background picture with empty data in database (remove the former background picture)
		const updateUserResult = await userService.updateUser(userId, updatedUserData);
		if (updateUserResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateUserResult.message);
		}

		return apiResponse.successResponse(res, "User background picture removed successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Verify the email address via the personalized link sent to the user
const verifyEmailChangeLink = async (req, res) => {
	try {
		const emailChangeValidationId = req.params.emailChangeValidationId;

		const emailVerified = await emailService.verifyEmailChangeValidationId(emailChangeValidationId);
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
	retrieveMyUserData,
	retrieveMyUserSettings,
	retrieveMyUserPrivacySettings,
	retrieveNewUsers,
	retrieveUserOverview,
	retrieveUserPublicData,
	retrieveUserPrivateProjects,

	updateUser,
	updateUserBioDescription,
	updateUserDetails,
	updateUserSettingsPrivacy,
	updateUserSettingsAppearance,
	updateUserSettingsDisplayMode,
	updateUserSettingsLanguage,
	updateUserSettingsNotifications,
	updateUserEmail,
	updateUserPassword,

	updateUserPicture,
	updateUserBackgroundPicture,
	removeUserPicture,
	removeUserBackgroundPicture,

	verifyEmailChangeLink,
};
