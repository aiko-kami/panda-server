const User = require("../models/user.model");
const CryptoJS = require("crypto-js");
const v4 = require("uuid").v4;
const { logger, emailDelivery } = require("../utils");

//Function to send verification email (to validate the user email address with a personalized link)
const sendVerificationEmail = async (userId) => {
	//Create email ID
	const emailId = v4;

	try {
		//Find user in the database
		const user = await User.findOne({ userId });

		//Return error if userId is not found
		if (!user) {
			return { status: "error", message: "Invalid userId." };
		} else if (user.emailVerified.verified) {
			return { status: "error", message: "Email already verified." };
		} else {
			const userEmail = user.email;
			const usernameCapitalized = user.username.charAt(0).toUpperCase() + user.username.slice(1);

			const dataToEncrypt = { emailId, userId };

			// Encrypt
			const encryptedData = CryptoJS.AES.encrypt(
				JSON.stringify(dataToEncrypt),
				process.env.ENCRYPT_KEY
			).toString();

			//Transform encrypted data into a valid link
			//Example https://www.neutroneer.com/sign-up/xxxxxxxxxxxxxxxxxxx
			const verification_link = `${process.env.WEBSITE_URL}/sign-up/${encodeURIComponent(
				encryptedData
			)}`;

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
				{ userId },
				{
					"emailVerified.emailId": emailId,
					"emailVerified.expirationTimestamp": Date.now() + 172800000, //email verification valid 48h
				}
			);
			logger.info("Verification email sent successfully.");
			return { status: "success", message: "Verification email sent successfully." };
		}
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

		const toDecrypt = bytes.toString(CryptoJS.enc.Utf8);
		if (!toDecrypt) {
			// Invalid or missing decrypted data
			throw new Error("Invalid validation link.");
		}

		var decrypted = JSON.parse(toDecrypt);

		if (!decrypted || !decrypted.emailId || !decrypted.userId) {
			// Invalid or missing decrypted data
			throw new Error("Invalid validation link.");
		}

		const emailIdDecrypted = decrypted.emailId;
		const userIdDecrypted = decrypted.userId;

		//Find user in the database
		const user = await User.findOne({ userId: userIdDecrypted });
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
				{ userId: user.userId },
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

module.exports = {
	sendVerificationEmail,
	verifyEmailValidationId,
};
