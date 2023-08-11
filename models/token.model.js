const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const accessTokenExpirationSeconds =
	parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_SECONDS) || 3600;
const refreshTokenExpirationSeconds =
	parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_SECONDS) || 604800;

// Schéma pour les access tokens
const accessTokenSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		token: { type: String, required: true },
		createdAt: {
			type: Date,
			default: DateTime.now(),
		},
		expiresAt: {
			type: Date,
			required: true,
			default: () => DateTime.now().plus({ seconds: accessTokenExpirationSeconds }).toJSDate(),
			expires: 0,
		},
	},
	{
		collection: "accessTokens",
	}
);

const AccessToken = mongoose.model("AccessToken", accessTokenSchema);

// Schéma pour les refresh tokens
const refreshTokenSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		token: { type: String, required: true },
		createdAt: {
			type: Date,
			default: DateTime.now(),
		},
		expiresAt: {
			type: Date,
			required: true,
			default: () => DateTime.now().plus({ seconds: refreshTokenExpirationSeconds }).toJSDate(),
			expires: 0,
		},
	},
	{
		collection: "refreshTokens",
	}
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = {
	AccessToken,
	RefreshToken,
};
