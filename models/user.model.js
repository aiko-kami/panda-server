const mongoose = require("mongoose");
const v4 = require("uuid").v4;
const { DateTime } = require("luxon");

const userSchema = new mongoose.Schema(
	{
		userId: { type: String, default: v4, required: true, unique: true },
		username: { type: String, required: true, unique: true, trim: true },
		usernameCapitalized: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true, lowercase: true },
		password: { type: String, required: true, trim: true },
		createdAt: { type: Date, default: DateTime.now().toHTTP(), required: true },
		lastConnection: { type: Date },
		emailVerified: {
			verified: { type: Boolean, required: true },
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
	},
	{
		collection: "users",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
