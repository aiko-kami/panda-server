const { userService } = require("../../services");
const { logger, apiResponse, validation, validationEmail } = require("../../utils");

// Signup user
const signup = async (req, res) => {
	const { username, email, password, confirmPassword } = req.body;

	try {
		// Validate input data
		const validate = validation.validateRegistrationInputs(
			username,
			email,
			password,
			confirmPassword
		);
		if (validate.status !== "success") {
			return apiResponse.clientErrorResponse(res, validate.message);
		}

		// Check if the username already exists in the database
		const existingUsername = await userService.checkUsernameAvailability(username);
		if (existingUsername) {
			return apiResponse.clientErrorResponse(res, "Username is already in use.");
		}

		// Check if the email already exists in the database
		const existingEmail = await userService.checkEmailAvailability(email);
		if (existingEmail) {
			return apiResponse.clientErrorResponse(res, "Email is already in use.");
		}

		// Signup new user
		const newUser = await userService.signupUser(username, email, password);

		//Send vaildation email to confirm email address
		const validationEmailSent = await validationEmail.sendValidationEmail(newUser.userId);
		if (validationEmailSent.status !== "success") {
			logger.error("Error occured while sending validation email: ", validationEmailSent);
			return apiResponse.serverErrorResponse(
				res,
				"An error occurred during signup. The validation email could not be sent."
			);
		}

		// Send the access token and refresh token in the response
		logger.info("New user successfully signed.", { userId: newUser.userId });
		return apiResponse.successResponse(res, "New user successfully signed.");

		//catch error if occurred during signup
	} catch (error) {
		logger.error("Error during signup:", error);
		return apiResponse.serverErrorResponse(res, "An error occurred during signup.");
	}
};

// Signup user
const verifyEmail = async (req, res) => {
	const emailValidationId = req.params.emailValidationId;

	const decodedLink = decodeURIComponent(emailValidationId);
	console.log(decodedLink);
	// Decrypt link
	const bytes = CryptoJS.AES.decrypt(decodedLink, process.env.ENCRYPT_KEY);
	var decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

	const emailIdDecrypted = decrypted.emailId;
	const userIdDecrypted = decrypted.userId;

	// Find user in the DB
	const user = await userService.retrieveUserById(userIdDecrypted, "emailVerified");

	if (!user) {
		//No user found in DB
		return { status: "error", message: "wrong userId" };
	} else if (user.emailVerified.verified) {
		//Email already verified
		return { status: "error", message: "email already verified" };
	} else if (user.emailVerified.expirationTimestamp < Date.now()) {
		//Link not valid anymore
		return { status: "error", message: "Verification link expired" };
	} else if (user.emailVerified.emailId !== emailIdDecrypted) {
		//Wrong emailId
		return { status: "error", message: "Wrong link" };
	} else if (user.emailVerified.emailId === emailIdDecrypted) {
		//Matching OK email validated, update emailVerified field in DB

		// Bouger toutes les updates de DB dans des Services. Créer un email validation service

		await User.findOneAndUpdate(
			{ userId: user.userId },
			{
				"emailVerified.verified": true,
				"emailVerified.expirationTimestamp": 0,
			}
		);

		return { status: "success", message: "Email has been successfully verified." };
	}

	try {
		// Validate input data
		const validate = validation.validateRegistrationInputs(
			username,
			email,
			password,
			confirmPassword
		);
		if (validate.status !== "success") {
			return apiResponse.clientErrorResponse(res, validate.message);
		}

		// Signup new user
		const newUser = await userService.signupUser(username, email, password);

		//Send vaildation email to confirm email address
		const validationEmailSent = await validationEmail.sendValidationEmail(newUser.userId);
		if (validationEmailSent.status !== "success") {
			logger.error("Error occured while sending validation email: ", validationEmailSent);
			return apiResponse.serverErrorResponse(
				res,
				"An error occurred during signup. The validation email could not be sent."
			);
		}

		// Send the access token and refresh token in the response
		logger.info("New user successfully signed.", { userId: newUser.userId });
		return apiResponse.successResponseWithData(res, "New user successfully signed.", {});

		//catch error if occurred during email verification link
	} catch (error) {
		logger.error("Error during email verification:", error);
		return apiResponse.serverErrorResponse(res, "An error occurred during email verification.");
	}
};

module.exports = {
	signup,
	verifyEmail,
};
