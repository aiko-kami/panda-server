const { User } = require("../models");
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require("uuid");
const { logger, encryptTools, emailDelivery, emailTemplates } = require("../utils");

//Function to send verification email (to validate the user email address with a personalized link)
const sendVerificationEmail = async (userId) => {
	//Create email ID
	const emailId = uuidv4();

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

		// Encrypt
		const dataToEncrypt = { emailId, userId };
		const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), process.env.ENCRYPT_KEY).toString();

		//Transform encrypted data into a valid link
		//Example https://www.makeit-lab.com/sign-up/xxxxxxxxxxxxxxxxxxx
		const verificationLink = `${process.env.WEBSITE_URL}/sign-up/${encodeURIComponent(encryptedData)}`;

		const emailInputs = {
			usernameCapitalized,
			verificationLink,
			emailTitle: "[Sheepy] please confirm your email",
		};
		//Put data in email template
		const emailContent = emailTemplates.useEmailAddressVerificationTemplate(emailInputs);

		//Send verification email containing the link
		const data = {
			service_id: process.env.EMAILJS_SERVICE_ID,
			template_id: process.env.EMAILJS_TEMPLATE_ID_STD_EMAIL,
			user_id: process.env.EMAILJS_USER_ID,
			accessToken: process.env.EMAILJS_ACCESS_TOKEN,
			template_params: {
				email_to: userEmail,
				html: emailContent,
				email_title: emailInputs.emailTitle,
			},
		};

		const sentMail = await emailDelivery.sendEmail(data);
		if (sentMail.status !== "success") {
			logger.error("Error while sending verification email: ", sentMail.message);
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

		const toDecrypt = bytes.toString(CryptoJS.enc.Utf8);
		try {
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

//Function to verify the personalized link used to validate the email address
const verifyEmailChangeValidationId = async (validationId) => {
	try {
		// Decrypt link
		const bytes = CryptoJS.AES.decrypt(decodeURIComponent(validationId), process.env.ENCRYPT_KEY);

		const toDecrypt = bytes.toString(CryptoJS.enc.Utf8);
		try {
			if (!toDecrypt) {
				// Invalid or missing decrypted data
				throw new Error("Invalid validation link.");
			}
		} catch (error) {
			logger.error("Error while verifying the email change validation link: Invalid validation link - Error: ", error);

			return {
				status: "error",
				message: "An error occurred while verifying the email change validation link: Invalid validation link",
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
		} else if (user.changeEmailVerified.verified) {
			//Email already verified
			throw new Error("Email already verified.");
		} else if (user.changeEmailVerified.expirationTimestamp < Date.now()) {
			//Link not valid anymore
			throw new Error("Verification link expired.");
		} else if (user.changeEmailVerified.emailId !== emailIdDecrypted) {
			//Wrong emailId
			throw new Error("Invalid validation link.");
		} else if (user.changeEmailVerified.emailId === emailIdDecrypted) {
			//Matching OK newemail validated, update changeEmailVerified field in DB
			await User.findOneAndUpdate(
				{ _id: objectIdUserId },
				{
					"changeEmailVerified.verified": true,
					email: user.changeEmailVerified.newEmail,
					"changeEmailVerified.expirationTimestamp": 0,
					"changeEmailVerified.newEmail": "",
				}
			);
			logger.info(`New email has been successfully verified. emailId: ${user.emailVerified.emailId}`);
			return { status: "success", message: "New email has been successfully verified." };
		}
	} catch (error) {
		logger.error("Error while verifying the email change validation link:", error);
		return {
			status: "error",
			message: `An error occurred while verifying the email change validation link: ${error.message}`,
		};
	}
};

//Function to send password reset email (when user forgot his/her password)
const sendPasswordResetEmail = async (email, username, resetPasswordToken) => {
	const usernameCapitalized = username.charAt(0).toUpperCase() + username.slice(1);
	try {
		// Construct the reset password link
		const resetLink = `${process.env.WEBSITE_URL}/forgot-password/${resetPasswordToken}`;

		const emailInputs = {
			usernameCapitalized,
			resetLink,
			emailTitle: "[Sheepy] Password change request",
		};
		//Put data in email template
		const emailContent = emailTemplates.useResetPasswordTemplate(emailInputs);

		// Send password reset email containing the link
		const data = {
			service_id: process.env.EMAILJS_SERVICE_ID,
			template_id: process.env.EMAILJS_TEMPLATE_ID_STD_EMAIL,
			user_id: process.env.EMAILJS_USER_ID,
			accessToken: process.env.EMAILJS_ACCESS_TOKEN,
			template_params: {
				email_to: email,
				html: emailContent,
				email_title: emailInputs.emailTitle,
			},
		};

		const sentMail = await emailDelivery.sendEmail(data);
		if (sentMail.status !== "success") {
			logger.error("Error while sending password reset email: ", sentMail.message);
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

//Function to send verification email when user changes email address (to validate the user email address with a personalized link)
const sendVerificationEmailChangeEmail = async (userId) => {
	//Create email ID
	const emailId = uuidv4();

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
		if (user.changeEmailVerified.verified) {
			return { status: "error", message: "Email already verified." };
		}

		const userNewEmail = user.changeEmailVerified.newEmail;
		const usernameCapitalized = user.username.charAt(0).toUpperCase() + user.username.slice(1);

		// Encrypt
		const dataToEncrypt = { emailId, userId };
		const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), process.env.ENCRYPT_KEY).toString();

		//Transform encrypted data into a valid link
		//Example https://www.makeit-lab.com/sign-up/xxxxxxxxxxxxxxxxxxx
		const verificationLink = `${process.env.WEBSITE_URL}/users/my-profile/email-change/${encodeURIComponent(encryptedData)}`;

		const emailInputs = {
			usernameCapitalized,
			verificationLink,
			emailTitle: "[Sheepy] please confirm your new email",
		};
		//Put data in email template
		const emailContent = emailTemplates.useChangeEmailAddressVerificationTemplate(emailInputs);

		//Send verification email containing the link
		const data = {
			service_id: process.env.EMAILJS_SERVICE_ID,
			template_id: process.env.EMAILJS_TEMPLATE_ID_STD_EMAIL,
			user_id: process.env.EMAILJS_USER_ID,
			accessToken: process.env.EMAILJS_ACCESS_TOKEN,
			template_params: {
				email_to: userNewEmail,
				html: emailContent,
				email_title: emailInputs.emailTitle,
			},
		};

		const sentMail = await emailDelivery.sendEmail(data);
		if (sentMail.status !== "success") {
			logger.error("Error while sending verification email: ", sentMail.message);
			return {
				status: "error",
				message: "An error occurred while sending the verification email.",
			};
		}

		//Insert emailID
		await User.findOneAndUpdate(
			{ _id: objectIdUserId },
			{
				"changeEmailVerified.emailId": emailId,
				"changeEmailVerified.expirationTimestamp": Date.now() + 172800000, //email verification valid 48h
			}
		);

		logger.info("Verification email sent successfully.");
		return { status: "success", message: "Verification email sent successfully." };
	} catch (error) {
		logger.error("Error sending verification email:", error);
		return { status: "error", message: "An error occurred while sending the verification email." };
	}
};

//Function to send notification email to admin when project has been submitted
const sendProjectSubmissionEmail = async (emailInputs) => {
	try {
		const emailContent = emailTemplates.useProjectSubmittedTemplate(emailInputs);

		//Send notification email
		const data = {
			service_id: process.env.EMAILJS_SERVICE_ID,
			template_id: process.env.EMAILJS_TEMPLATE_ID_STD_EMAIL,
			user_id: process.env.EMAILJS_USER_ID,
			accessToken: process.env.EMAILJS_ACCESS_TOKEN,
			template_params: {
				email_to: emailInputs.adminEmail,
				html: emailContent,
				email_title: emailInputs.emailTitle,
			},
		};

		const sentMail = await emailDelivery.sendEmail(data);
		if (sentMail.status !== "success") {
			logger.error("Error while sending admin approval notification email: ", sentMail);
			return { status: "error", message: "An error occurred while sending the admin approval notification email." };
		}

		logger.info("Approval notification email sent successfully to admin.");
		return { status: "success", message: "Approval notification email sent successfully to admin." };
	} catch (error) {
		logger.error("Error sending approval notification email to admin:", error);
		return { status: "error", message: "An error occurred while sending the approval notification email to admin." };
	}
};

//Function to send notification email to a project creator to inform that the project approval has been processed (project has been approved or rejected)
const sendProjectApprovalEmail = async (emailInputs) => {
	try {
		const emailContent = emailTemplates.useProjectApprovalTemplate(emailInputs);

		//Send notification email
		const data = {
			service_id: process.env.EMAILJS_SERVICE_ID,
			template_id: process.env.EMAILJS_TEMPLATE_ID_STD_EMAIL,
			user_id: process.env.EMAILJS_USER_ID,
			accessToken: process.env.EMAILJS_ACCESS_TOKEN,
			template_params: {
				email_to: emailInputs.projectCreatorEmail,
				html: emailContent,
				email_title: emailInputs.emailTitle,
			},
		};

		const sentMail = await emailDelivery.sendEmail(data);
		if (sentMail.status !== "success") {
			logger.error("Error while sending project approval notification email: ", sentMail.message);
			return { status: "error", message: "An error occurred while sending the project approval notification email." };
		}

		logger.info("Project approval notification email sent successfully.");
		return { status: "success", message: "Project approval notification email sent successfully." };
	} catch (error) {
		logger.error("Error sending project approval notification email:", error);
		return { status: "error", message: "An error occurred while sending the project approval notification email." };
	}
};

module.exports = {
	sendVerificationEmail,
	verifyEmailValidationId,
	verifyEmailChangeValidationId,
	sendPasswordResetEmail,
	sendVerificationEmailChangeEmail,
	sendProjectSubmissionEmail,
	sendProjectApprovalEmail,
};
