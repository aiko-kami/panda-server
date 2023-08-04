const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { DateTime } = require("luxon");
const { logger } = require("../utils");

const v4 = require("uuid").v4;

const retrieveUserById = async (id, fields) => {
	const user = User.findOne({ userId: id }).select(`-_id ${fields}`);
	if (!user) {
		return { status: "error", message: "User not found." };
	}
	return user;
};

const retrieveNewUsers = async (limit, fields) => {
	const users = User.find().sort({ createdAt: -1 }).limit(limit).select(`-_id ${fields}`);
	if (!users) {
		return { status: "error", message: "No user found." };
	}
	return users;
};

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
		const userId = v4();

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			userId,
			username,
			email,
			password: hashedPassword,
			createdAt: DateTime.now().toHTTP(),
			emailVerified: {
				verified: false,
				emailId: "",
			},
			image: "",
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
	retrieveUserById,
	retrieveNewUsers,
	checkUsernameAndEmailAvailability,
	signupUser,
};
