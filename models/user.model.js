const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	username: { type: String, required: true, unique: true, trim: true },
	email: { type: String, required: true, unique: true, trim: true, lowercase: true },
	password: { type: String, required: true, trim: true },
	createdAt: { type: Date, default: Date.now, required: true },
	emailVerified: {
		verified: { type: Boolean },
		emailId: { type: String },
		expirationTimestamp: { type: Number },
	},
	profilePicture: { type: String },
	location: { city: { type: String }, country: { type: String } },
	company: { type: String },
	description: { type: String },
	bio: { type: String },
	languages: [{ type: String }],
	website: { type: String },
	lastConnection: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
