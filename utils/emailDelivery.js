const logger = require("./logger");

// Function to send a vaildation email to confirm email address
const sendEmail = async (data) => {
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
			throw new Error(errorText);
		}
	} catch (error) {
		logger.error("Error while sending an email: " + error.message);
		return { status: "error", message: error.message };
	}
};

module.exports = {
	sendEmail,
};
