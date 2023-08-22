const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { logger } = require("../utils");

const checkUsernameAndEmailAvailability = async (username, email) => {
	const existingUser = await User.findOne({ $or: [{ username }, { email }] });

	if (existingUser) {
		return {
			status: "error",
			message:
				existingUser.username === username
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
		const newUser = new User({
			username: username,
			email: email,
			password: hashedPassword,
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
		await newUser.save();

		logger.info(`New user successfully signed up. UserId: ${newUser.userId}`);
		return {
			status: "success",
			message: `New user successfully signed up. UserId: ${newUser.userId}`,
			data: newUser,
		};
	} catch (error) {
		// Log the error and return a structured response with error details
		logger.error("Error while signing up user: ", error);
		return { status: "error", message: "An error occurred while signing up user." };
	}
};

module.exports = {
	checkUsernameAndEmailAvailability,
	signupUser,
};
