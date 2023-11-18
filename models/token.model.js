const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");

const refreshTokenExpirationSeconds = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS) || 604800;
const resetPasswordTokenExpirationSeconds = parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRATION_SECONDS) || 86400;

// Schema for refresh tokens
const refreshTokenSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		token: { type: String, required: true },
		expiresAt: {
			type: Date,
			required: true,
			default: () => DateTime.now().plus({ seconds: refreshTokenExpirationSeconds }).toJSDate(),
			expires: 0,
		},
	},
	{
		collection: "refreshTokens",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const RefreshToken = dbConnectionPrivate.model("RefreshToken", refreshTokenSchema);

// Schema for reset password tokens
const resetPasswordTokenSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		token: { type: String, required: true },
		expiresAt: {
			type: Date,
			required: true,
			default: () => DateTime.now().plus({ seconds: resetPasswordTokenExpirationSeconds }).toJSDate(),
			expires: 0,
		},
	},
	{
		collection: "resetPasswordTokens",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const ResetPasswordToken = dbConnectionPrivate.model("ResetPasswordToken", resetPasswordTokenSchema);

module.exports = {
	RefreshToken,
	ResetPasswordToken,
};
