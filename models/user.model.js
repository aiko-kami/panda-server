const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");
const config = require("../config");

const userVisibility = config.user_visibility;

const privacyString = new Schema({
	_id: false,
	data: { type: String },
	privacy: {
		type: String,
		required: true,
		default: userVisibility[0],
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
		changeEmailVerified: {
			newEmail: { type: String },
			verified: { type: Boolean, required: true },
			emailId: { type: String },
			expirationTimestamp: { type: Number },
		},
		description: { type: String },
		profilePicture: {
			key: { type: String },
			link: { type: String },
			privacy: {
				type: String,
				required: true,
				default: userVisibility[0],
				enum: userVisibility,
				message: "The value {VALUE} is not valid.",
			},
		},
		backgroundPicture: {
			key: { type: String },
			link: { type: String },
			privacy: {
				type: String,
				required: true,
				default: userVisibility[0],
				enum: userVisibility,
				message: "The value {VALUE} is not valid.",
			},
		},
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
				default: userVisibility[0],
				enum: userVisibility,
				message: "The value {VALUE} is not valid.",
			},
		},
		projectLikePrivacy: {
			type: String,
			required: true,
			default: userVisibility[0],
			enum: userVisibility,
			message: "The value {VALUE} is not valid.",
		},
		website: privacyString,
		talents: [
			{
				_id: false,
				name: { type: String, required: true, unique: true },
				description: { type: String },
				skills: { type: String },
				experience: { type: String },
				portfolio: { type: String },
				certifications: { type: String },
			},
		],
		notifications: {
			globalNotif: {
				type: Number,
				required: true,
				default: 0,
			},
			myProfileNotif: {
				type: Number,
				required: true,
				default: 0,
			},
			myProjectsNotif: {
				type: Number,
				required: true,
				default: 0,
			},
			myMessagesNotif: {
				type: Number,
				required: true,
				default: 0,
			},
			mySettingsNotif: {
				type: Number,
				required: true,
				default: 0,
			},
			helpNotif: {
				type: Number,
				required: true,
				default: 0,
			},
			invitationsNotif: {
				type: Number,
				required: true,
				default: 0,
			},
			requestsNotif: {
				type: Number,
				required: true,
				default: 0,
			},
		},
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
