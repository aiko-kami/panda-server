const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { DateTime } = require("luxon");

const v4 = require("uuid").v4;

const retrieveUserById = async (id, fields) => {
	return User.findOne({ userId: id }).select(`-_id ${fields}`);
};

const retrieveNewUsers = async (limit, fields) => {
	return User.find().sort({ createdAt: -1 }).limit(limit).select(`-_id ${fields}`);
};

async function checkUsernameAvailability(username) {
	return await User.findOne({ username });
}

async function checkEmailAvailability(email) {
	return await User.findOne({ email });
}

async function signupUser(username, email, password) {
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
	return await newUser.save();
}

module.exports = {
	retrieveUserById,
	retrieveNewUsers,
	checkUsernameAvailability,
	checkEmailAvailability,
	signupUser,
};
