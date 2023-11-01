const mongoose = require("mongoose");
const { dbConnectionAdmin } = require("../config/db.config");
const v4 = require("uuid").v4;
const { DateTime } = require("luxon");

const adminUserSchema = new mongoose.Schema(
	{
		adminUserId: { type: String, default: v4, required: true, unique: true },
		username: { type: String, required: true, unique: true, trim: true },
		usernameCapitalized: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true, lowercase: true },
		password: { type: String, required: true, trim: true },
		createdAt: { type: Date, default: DateTime.now().toHTTP(), required: true },
		lastConnection: { type: Date },
		profilePicture: { type: String },
		location: { city: { type: String }, country: { type: String } },
		description: { type: String },
		bio: { type: String },
		languages: [{ type: String }],
		website: { type: String },
	},
	{
		collection: "admins",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

/*
// Custom validator to ensure at least one talent is present
userSchema.path("talents").validate(function (value) {
	return value && value.length > 0;
}, "At least one talent is required.");
*/

const AdminUser = dbConnectionAdmin.model("AdminUser", adminUserSchema);

module.exports = AdminUser;
