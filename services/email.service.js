const { User } = require("../models");
const CryptoJS = require("crypto-js");
const v4 = require("uuid").v4;
const { logger, encryptTools, emailDelivery, emailTemplates } = require("../utils");

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

		// Encrypt
		const dataToEncrypt = { emailId, userId };
		const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), process.env.ENCRYPT_KEY).toString();

		//Transform encrypted data into a valid link
		//Example https://www.neutroneer.com/sign-up/xxxxxxxxxxxxxxxxxxx
		const verificationLink = `${process.env.WEBSITE_URL}/sign-up/${encodeURIComponent(encryptedData)}`;

		const emailInputs = {
			usernameCapitalized,
			verificationLink,
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
				email_title: "[Sheepy] please confirm your email",
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

		const emailInputs = {
			usernameCapitalized,
			resetLink,
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
				email_title: "[Sheepy] Password change request",
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
				email_title: "[Sheepy - Admin] New Project Submitted - Approval Required",
			},
		};

		const sentMail = await emailDelivery.sendEmail(data);
		if (sentMail.status !== "success") {
			logger.error("Error while sending email: ", sentMail);
			return { status: "error", message: "An error occurred while sending the email." };
		}

		logger.info("Notification email sent successfully to admin.");
		return { status: "success", message: "Notification email sent successfully to admin." };
	} catch (error) {
		logger.error("Error sending Notification email to admin:", error);
		return { status: "error", message: "An error occurred while sending the Notification email to admin." };
	}
};

//Function to send notification email to a project creator to inform that the project approval has been processed (project has been approved or rejected)
const sendProjectApprovalEmail = async (userId, projectId, projectTitle, projectApproval) => {
	try {
		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		//Find user in the database
		const user = await User.findOne({ _id: objectIdUserId }).select("username email");

		//Return error if userId is not found
		if (!user) {
			return { status: "error", message: "Invalid userId." };
		}

		const userEmail = user.email;
		const usernameCapitalized = user.username.charAt(0).toUpperCase() + user.username.slice(1);

		const approval = projectApproval.approval;
		const reason = projectApproval.reason;

		let mailContentPart1, mailContentPart2, mailContentPart3;
		if (approval === "approved") {
			mailContentPart1 = `Good news! Your project ${projectTitle} has been approved and is now live on our platform. Congratulations on reaching this first milestone!`;
			mailContentPart2 = "Check out your project here:";
			mailContentPart3 = "We wish you all the best with your project journey. Thank you for contributing to our community!";
		} else if (approval === "rejected") {
			mailContentPart1 = `We regret to inform you that your project ${projectTitle} has been rejected due to the following reason: ${reason}`;
			mailContentPart2 =
				"We appreciate your effort and creativity, and we encourage you to review the feedback provided and make the necessary adjustments. Feel free to review your project details and submit it again. Update your project here:";
			mailContentPart3 = "If you believe this is an error or if you have questions, please contact our support team. Thank you for your understanding.";
		}

		//Link to the project
		//Example https://www.neutroneer.com/project/xxxxxxxxxxxxxxxxxxx
		const project_link = `${process.env.WEBSITE_URL}/project/${projectId}`;

		//Send verification email containing the link
		const data = {
			service_id: process.env.EMAILJS_SERVICE_ID,
			template_id: process.env.EMAILJS_TEMPLATE_ID_VERIF,
			user_id: process.env.EMAILJS_USER_ID,
			accessToken: process.env.EMAILJS_ACCESS_TOKEN,
			template_params: {
				to_name: usernameCapitalized,
				email_to: userEmail,
				project_link,
				mailContentPart1,
				mailContentPart2,
				mailContentPart3,
			},
		};

		const sentMail = await emailDelivery.sendEmail(data);
		if (sentMail.status !== "success") {
			logger.error("Error while sending project approval notification email: ", sentMail.message);
			return {
				status: "error",
				message: "An error occurred while sending the project approval notification email.",
			};
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
	sendPasswordResetEmail,
	sendProjectSubmissionEmail,
	sendProjectApprovalEmail,
};
