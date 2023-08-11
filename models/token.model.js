const mongoose = require("mongoose");
const { DateTime } = require("luxon");

// Schéma pour les access tokens
const accessTokenSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		token: { type: String, required: true },
		createdAt: {
			type: Date,
			default: Date.now,
		},
		expiresAt: {
			type: Date,
			required: true,
			default: Date.now() + parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_SECONDS),
			expires: process.env.JWT_ACCESS_TOKEN_EXPIRATION_SECONDS,
			index: { expires: 0 },
		},
	},
	{
		collection: "accessTokens",
	}
);

const AccessToken = mongoose.model("AccessToken", accessTokenSchema);

// Schéma pour les refresh tokens
const refreshTokenSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	token: { type: String, required: true },
	createdAt: {
		type: Date,
		default: Date.now,
	},
	expiresAt: {
		type: Date,
		required: true,
		default: Date.now() + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_SECONDS),
		expires: process.env.JWT_REFRESH_TOKEN_EXPIRATION_SECONDS,
		index: { expires: 0 },
	},
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = {
	AccessToken,
	RefreshToken,
};
