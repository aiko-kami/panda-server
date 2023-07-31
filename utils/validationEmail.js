const User = require("../models/user.model");
const CryptoJS = require("crypto-js");
const v4 = require("uuid").v4;

// Function to send a vaildation email to confirm email address
const sendEmail = async function (data) {
	try {
		const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (response.ok) {
			return { status: "success", message: "Email sent successfully!" };
		} else {
			const errorText = await response.text();
			return { status: "error", message: errorText };
		}
	} catch (error) {
		console.error("Oops... " + error);
		return { status: "error", message: "An error occurred while sending the email." };
	}
};

//Function to send verification email (to validate the user email address with a personalized link)
const sendValidationEmail = async function (userId) {
	//Create email ID
	const emailId = v4();

	try {
		//Find user in the DB
		const user = await User.findOne({ userId });

		//Return error if userId is not found
		if (!user) {
			return { status: "error", message: "Invalid userId" };
		} else if (user.emailVerified.verified) {
			return { status: "error", message: "Email already verified" };
		} else {
			//Insert emailID
			await User.findOneAndUpdate(
				{ userId },
				{
					"emailVerified.emailId": emailId,
					"emailVerified.expirationTimestamp": Date.now() + 172800000, //email verification valid 48h
				},
				{ new: true }
			);

			const userEmail = user.email;
			const username = user.username;
			const dataToEncrypt = { emailId, userId };

			// Encrypt
			const encryptedData = CryptoJS.AES.encrypt(
				JSON.stringify(dataToEncrypt),
				process.env.ENCRYPT_KEY
			).toString();

			//Transform encrypted data into a valid link
			const link = "https://www.neutroneer.com/sign-up/" + encodeURIComponent(encryptedData);

			//Send verification email containing the link
			const data = {
				service_id: process.env.EMAILJS_SERVICE_ID,
				template_id: process.env.EMAILJS_TEMPLATE_ID_VERIF,
				user_id: process.env.EMAILJS_USER_ID,
				accessToken: process.env.EMAILJS_ACCESS_TOKEN,
				template_params: {
					to_name: username,
					email_to: userEmail,
					link,
				},
			};
			const sentMail = await sendEmail(data);
			console.log("🚀 ~ file: validationEmail.js:79 ~ sendValidationEmail ~ sentMail:", sentMail);
			return { status: "success", message: "Verification email sent successfully!" };
		}
	} catch (error) {
		console.error("Error sending validation email:", error);
		return { status: "error", message: "An error occurred while sending the validation email." };
	}
};

module.exports = {
	sendValidationEmail,
};
