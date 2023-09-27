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
		talents: [
			{
				name: { type: String, required: true },
				description: { type: String, required: true },
				skills: { type: String, required: true },
				experience: { type: String, required: true },
				portfolio: { type: String, required: true },
				certifications: { type: String, required: true },
			},
		],
	},
	{
		collection: "users",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

/*
// Custom validator to ensure at least one talent is present
userSchema.path("talents").validate(function (value) {
	return value && value.length > 0;
}, "At least one talent is required.");
*/

const User = mongoose.model("User", userSchema);

module.exports = User;
