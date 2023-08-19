const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const { logger } = require("../../utils");

const updateUserPassword = async (userId, newPassword) => {
	try {
		// Hachez le nouveau mot de passe avant de le mettre à jour dans la base de données
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		console.log("🚀 ~ updateUserPassword ~ hashedPassword:", hashedPassword);

		// Mettez à jour le mot de passe dans la base de données pour l'utilisateur avec userId
		await User.findOneAndUpdate({ userId }, { password: hashedPassword });

		logger.info(`User password updated successfully. userId: ${userId}`);

		return {
			status: "success",
			message: "User password updated successfully.",
		};
	} catch (error) {
		logger.error(`Error while updating user password: ${error}`);

		return {
			status: "error",
			message: "An error occurred while updating the user password.",
		};
	}
};

module.exports = {
	updateUserPassword,
};
