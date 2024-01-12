const logger = require("../logger");
const axios = require("axios");

/**
 * Sends an email using an external email service (EmailJS).
 *
 * @param {Object} data - The email data to be sent, including template parameters, EmailJS service ID, EmailJS template ID, EmailJS user ID, EmailJS access token.
 * @returns {Promise<Object>} - A promise that resolves to an object indicating the email sending status.
 *                            - If successful, it returns { status: "success", message: "Email sent successfully." }
 *                            - If there's an error, it returns { status: "error", message: <error_message> }
 * @throws {Error} - If the HTTP request to the email service fails or if the response status is not OK.
 */
const sendEmail = async (data) => {
	try {
		// Ignore SSL certificate issues (for testing purposes only)
		process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

		// Send an HTTP POST request to the email service API with the provided email data.
		const response = await axios.post("https://api.emailjs.com/api/v1.0/email/send", data, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Check if the HTTP response is OK (status code 200).
		if (response.status === 200) {
			return { status: "success", message: "Email sent successfully." };
		} else {
			// If the response status is not OK, extract the error text from the response and throw an error.
			throw new Error(response.statusText);
		}
	} catch (error) {
		logger.error("Error while sending email: ", error);
		return { status: "error", message: error.message };
	}
};

module.exports = {
	sendEmail,
};
