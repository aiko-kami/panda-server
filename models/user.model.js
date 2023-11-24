const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");
const config = require("../config");

const userVisibility = config.user_visibility;
const public = config.user_visibility[0];
const private = config.user_visibility[1];

const privacyString = new Schema({
	_id: false,
	data: { type: String },
	privacy: {
		type: String,
		required: true,
		default: public,
		enum: userVisibility,
		message: "The value {VALUE} is not valid.",
	},
});

const userSchema = new Schema(
	{
		userId: { type: String, unique: true },
		username: { type: String, required: true, unique: true, trim: true },
		usernameCapitalized: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true, lowercase: true },
		password: { type: String, required: true, trim: true },
		createdAt: {
			type: Date,
			default: DateTime.now().toHTTP(),
			required: true,
		},
		lastConnection: { type: Date },
		emailVerified: {
			verified: { type: Boolean, required: true },
			emailId: { type: String },
			expirationTimestamp: { type: Number },
		},
		description: { type: String },
		profilePicture: privacyString,
		location: {
			city: privacyString,
			country: privacyString,
		},
		company: privacyString,
		bio: privacyString,
		languages: {
			data: [{ type: String }],
			privacy: {
				type: String,
				required: true,
				default: public,
				enum: userVisibility,
				message: "The value {VALUE} is not valid.",
			},
		},
		website: privacyString,
		talents: [
			{
				name: { type: String, required: true, unique: true },
				description: { type: String },
				skills: { type: String },
				experience: { type: String },
				portfolio: { type: String },
				certifications: { type: String },
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

const User = dbConnectionPrivate.model("User", userSchema);

module.exports = User;
