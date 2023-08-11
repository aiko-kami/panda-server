const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const refreshTokenExpirationSeconds =
	parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_SECONDS) || 604800;

// Schema for refresh tokens
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
	RefreshToken,
};
