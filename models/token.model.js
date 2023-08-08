const mongoose = require("mongoose");

// Schéma pour les access tokens
const accessTokenSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	token: { type: String, required: true },
	createdAt: {
		type: Date,
		default: Date.now,
		expires: process.env.JWT_ACCESS_TOKEN_EXPIRATION_SECONDS,
	},
});

const AccessToken = mongoose.model("AccessToken", accessTokenSchema);

// Schéma pour les refresh tokens
const refreshTokenSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	token: { type: String, required: true },
	createdAt: {
		type: Date,
		default: Date.now,
		expires: process.env.JWT_REFRESH_TOKEN_EXPIRATION_SECONDS,
	},
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = {
	AccessToken,
	RefreshToken,
};
