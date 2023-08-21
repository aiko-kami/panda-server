const mongoose = require("mongoose");
const v4 = require("uuid").v4;
const { DateTime } = require("luxon");

const userSchema = new mongoose.Schema(
	{
		userId: { type: String, default: v4(), required: true },
		username: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true, lowercase: true },
		password: { type: String, required: true, trim: true },
		createdAt: { type: Date, default: DateTime.now().toHTTP(), required: true },
		emailVerified: {
			verified: { type: Boolean, required: true },
			emailId: { type: String },
			expirationTimestamp: { type: Number, required: true },
		},
		profilePicture: { type: String },
		location: { city: { type: String }, country: { type: String } },
		company: { type: String },
		description: { type: String },
		bio: { type: String },
		languages: [{ type: String }],
		website: { type: String },
		lastConnection: { type: Date },
	},
	{
		collection: "users",
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
