const User = require("../models/user.model");
const CryptoJS = require("crypto-js");
const v4 = require("uuid").v4;

//Bouger sendValidationEmail et verifyEmail dans un service dédié emailValidation.service
//Garder sendEmail en tant que utils

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
			return { status: "success", message: "Email sent successfully." };
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
		//Find user in the DB ===>
		const user = await User.findOne({ userId });

		//Return error if userId is not found
		if (!user) {
			return { status: "error", message: "Invalid userId" };
		} else if (user.emailVerified.verified) {
			return { status: "error", message: "Email already verified" };
		} else {
			const userEmail = user.email;
			const username = user.username;
			const dataToEncrypt = { emailId, userId };

			// Encrypt
			const encryptedData = CryptoJS.AES.encrypt(
				JSON.stringify(dataToEncrypt),
				process.env.ENCRYPT_KEY
			).toString();

			//Transform encrypted data into a valid link
			//Example https://www.neutroneer.com/signup/xxxxxxxxxxxxxxxxxxx
			const link = `${process.env.WEBSITE_URL}/signup/${encodeURIComponent(encryptedData)}`;

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
			console.log(Date.now() + 172800000);
			if (sentMail.status !== "success") {
				return { status: "error", message: sentMail.message };
			}

			//Insert emailID
			await User.findOneAndUpdate(
				{ userId },
				{
					"emailVerified.emailId": emailId,
					"emailVerified.expirationTimestamp": Date.now() + 172800000, //email verification valid 48h
				},
				{ new: true }
			);

			return { status: "success", message: "Verification email sent successfully." };
		}
	} catch (error) {
		console.error("Error sending validation email:", error);
		return { status: "error", message: "An error occurred while sending the validation email." };
	}
};

/* 
!! TO be added: errors in case of wrong/fake link 
*/

//Function to verify the personalized link used to validate the email address
const verifyEmail = async function (validationId) {
	const decodedLink = decodeURIComponent(validationId);
	console.log(decodedLink);
	// Decrypt link
	const bytes = CryptoJS.AES.decrypt(decodedLink, process.env.ENCRYPT_KEY);
	var decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

	const emailIdDecrypted = decrypted.emailId;
	const userIdDecrypted = decrypted.userId;

	//Find user in the DB
	const user = await User.findOne({ userId: userIdDecrypted });
	//Return error if userId is not found
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
		await User.findOneAndUpdate(
			{ userId: user.userId },
			{
				"emailVerified.verified": true,
				"emailVerified.expirationTimestamp": 0,
			}
		);

		return { status: "success", message: "Email has been successfully verified." };
	}
};

module.exports = {
	sendValidationEmail,
	verifyEmail,
};
