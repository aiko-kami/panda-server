const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const { logger, encryptTools } = require("../../utils");

const verifyUsernameAndEmailAvailability = async (username, email) => {
	const usernameCapitalized = username.toUpperCase();
	const existingUser = await User.findOne({ $or: [{ usernameCapitalized }, { email }] });

	if (existingUser) {
		return {
			status: "error",
			message: existingUser.usernameCapitalized === usernameCapitalized ? "Username is already in use." : "Email is already in use.",
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
			profilePicture: { key: "", link: "" },
			location: {
				city: { data: "" },
				country: { data: "" },
			},
			company: { data: "" },
			description: "",
			bio: { data: "" },
			languages: { data: [] },
			website: { data: "" },
		});

		// Save the user to the database
		const created = await user.save();

		//Add encrypted ID
		const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());
		const createdUser = await User.findOneAndUpdate({ _id: created._id }, { userId: encryptedId }, { new: true }).select("-_id -__v");

		logger.info(`New user successfully signed up. UserId: ${createdUser.userId}`);
		return {
			status: "success",
			message: `New user successfully signed up. UserId: ${createdUser.userId}`,
			user: createdUser,
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
