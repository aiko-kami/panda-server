const { User } = require("../models");
const CryptoJS = require("crypto-js");
const v4 = require("uuid").v4;
const { logger, encryptTools, emailDelivery } = require("../utils");

//Function to send verification email (to validate the user email address with a personalized link)
const sendVerificationEmail = async (userId) => {
	//Create email ID
	const emailId = v4();

	try {
		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		//Find user in the database
		const user = await User.findOne({ _id: objectIdUserId });

		//Return error if userId is not found
		if (!user) {
			return { status: "error", message: "Invalid userId." };
		}
		if (user.emailVerified.verified) {
			return { status: "error", message: "Email already verified." };
		}

		const userEmail = user.email;
		const usernameCapitalized = user.username.charAt(0).toUpperCase() + user.username.slice(1);

		const dataToEncrypt = { emailId, userId };

		// Encrypt
		const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), process.env.ENCRYPT_KEY).toString();

		//Transform encrypted data into a valid link
		//Example https://www.neutroneer.com/sign-up/xxxxxxxxxxxxxxxxxxx
		const verification_link = `${process.env.WEBSITE_URL}/sign-up/${encodeURIComponent(encryptedData)}`;

		//Send verification email containing the link
		const data = {
			service_id: process.env.EMAILJS_SERVICE_ID,
			template_id: process.env.EMAILJS_TEMPLATE_ID_VERIF,
			user_id: process.env.EMAILJS_USER_ID,
			accessToken: process.env.EMAILJS_ACCESS_TOKEN,
			template_params: {
				to_name: usernameCapitalized,
				email_to: userEmail,
				verification_link,
			},
		};

		const sentMail = await emailDelivery.sendEmail(data);
		if (sentMail.status !== "success") {
			logger.error("Error while sending verification email: ", sentMail);
			return {
				status: "error",
				message: "An error occurred while sending the verification email.",
			};
		}

		//Insert emailID
		await User.findOneAndUpdate(
			{ _id: objectIdUserId },
			{
				"emailVerified.emailId": emailId,
				"emailVerified.expirationTimestamp": Date.now() + 172800000, //email verification valid 48h
			}
		);

		logger.info("Verification email sent successfully.");
		return { status: "success", message: "Verification email sent successfully." };
	} catch (error) {
		logger.error("Error sending verification email:", error);
		return { status: "error", message: "An error occurred while sending the verification email." };
	}
};

//Function to verify the personalized link used to validate the email address
const verifyEmailValidationId = async (validationId) => {
	try {
		// Decrypt link
		const bytes = CryptoJS.AES.decrypt(decodeURIComponent(validationId), process.env.ENCRYPT_KEY);

		try {
			const toDecrypt = bytes.toString(CryptoJS.enc.Utf8);
			if (!toDecrypt) {
				// Invalid or missing decrypted data
				throw new Error("Invalid validation link.");
			}
		} catch (error) {
			logger.error("Error while verifying the email validation link: Invalid validation link - Error: ", error);
			return {
				status: "error",
				message: "An error occurred while verifying the email validation link: Invalid validation link",
			};
		}

		var decrypted = JSON.parse(toDecrypt);

		if (!decrypted || !decrypted.emailId || !decrypted.userId) {
			// Invalid or missing decrypted data
			throw new Error("Invalid validation link.");
		}

		const emailIdDecrypted = decrypted.emailId;
		const userIdDecrypted = decrypted.userId;

		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userIdDecrypted);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		//Find user in the database
		const user = await User.findOne({ _id: objectIdUserId });
		//Return error if userId is not found
		if (!user) {
			//No user found in DB
			throw new Error("Invalid validation link.");
		} else if (user.emailVerified.verified) {
			//Email already verified
			throw new Error("Email already verified.");
		} else if (user.emailVerified.expirationTimestamp < Date.now()) {
			//Link not valid anymore
			throw new Error("Verification link expired.");
		} else if (user.emailVerified.emailId !== emailIdDecrypted) {
			//Wrong emailId
			throw new Error("Invalid validation link.");
		} else if (user.emailVerified.emailId === emailIdDecrypted) {
			//Matching OK email validated, update emailVerified field in DB
			await User.findOneAndUpdate(
				{ _id: objectIdUserId },
				{
					"emailVerified.verified": true,
					"emailVerified.expirationTimestamp": 0,
				}
			);
			logger.info(`Email has been successfully verified. emailId: ${user.emailVerified.emailId}`);
			return { status: "success", message: "Email has been successfully verified." };
		}
	} catch (error) {
		logger.error("Error while verifying the email validation link:", error);
		return {
			status: "error",
			message: `An error occurred while verifying the email validation link: ${error.message}`,
		};
	}
};

//Function to send password reset email (when user forgot his/her password)
const sendPasswordResetEmail = async (email, username, resetPasswordToken) => {
	const usernameCapitalized = username.charAt(0).toUpperCase() + username.slice(1);
	try {
		// Construct the reset password link
		const resetLink = `${process.env.WEBSITE_URL}/forgotPassword/${resetPasswordToken}`;

		// Send password reset email containing the link
		const data = {
			service_id: process.env.EMAILJS_SERVICE_ID,
			template_id: process.env.EMAILJS_TEMPLATE_RESET_PASSWORD,
			user_id: process.env.EMAILJS_USER_ID,
			accessToken: process.env.EMAILJS_ACCESS_TOKEN,
			template_params: {
				to_name: usernameCapitalized,
				email_to: email,
				reset_link: resetLink,
			},
		};

		const sentMail = await emailDelivery.sendEmail(data);
		if (sentMail.status !== "success") {
			logger.error("Error while sending password reset email: ", sentMail);
			return {
				status: "error",
				message: "An error occurred while sending the password reset email.",
			};
		}

		logger.info("Password reset email sent successfully.");
		return { status: "success", message: "Password reset email sent successfully." };
	} catch (error) {
		logger.error("Error sending password reset email:", error);
		return {
			status: "error",
			message: "An error occurred while sending the password reset email.",
		};
	}
};

module.exports = {
	sendVerificationEmail,
	verifyEmailValidationId,
	sendPasswordResetEmail,
};
