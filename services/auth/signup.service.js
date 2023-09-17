const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const { logger } = require("../../utils");

const verifyUsernameAndEmailAvailability = async (username, email) => {
	const usernameCapitalized = username.toUpperCase();
	const existingUser = await User.findOne({ $or: [{ usernameCapitalized }, { email }] });

	if (existingUser) {
		return {
			status: "error",
			message:
				existingUser.usernameCapitalized === usernameCapitalized
					? "Username is already in use."
					: "Email is already in use.",
		};
	}
	// If username and email are available, return null
	return null;
};

const signupUser = async (username, email, password) => {
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({
			username: username,
			usernameCapitalized: username.toUpperCase(),
			email: email,
			password: hashedPassword,
			lastConnection: 0,
			emailVerified: {
				verified: false,
				emailId: "",
			},
			profilePicture: "",
			location: {
				city: "",
				country: "",
			},
			company: "",
			description: "",
			bio: "",
			languages: [],
			website: "",
		});
		await user.save();

		logger.info(`New user successfully signed up. UserId: ${user.userId}`);
		return {
			status: "success",
			message: `New user successfully signed up. UserId: ${user.userId}`,
			user,
		};
	} catch (error) {
		// Log the error and return a structured response with error details
		logger.error("Error while signing up user: ", error);
		return { status: "error", message: "An error occurred while signing up user." };
	}
};

module.exports = {
	verifyUsernameAndEmailAvailability,
	signupUser,
};
