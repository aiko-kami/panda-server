/**
 * Users routes
 */

const usersRoute = require("express").Router();

const { userController, talentController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Me
usersRoute.get("/me", verifyAccess, userController.retrieveMyUserData);
usersRoute.patch("/me", verifyAccess, userController.updateUser);

// Talents
usersRoute.post("/talent/add/me", verifyAccess, talentController.createTalent);
usersRoute.patch("/talent/update/me", verifyAccess, talentController.updateTalent);
usersRoute.delete("/talent/remove/me", verifyAccess, talentController.removeTalent);

// Change password
usersRoute.patch("/changePassword", verifyAccess, userController.updateUserPassword);

// User overview
usersRoute.get("/userOverview/:userId", (req, res) => {
	res.json({
		message: `User ${req.params.userId} overview page`,
	});
});

// New User Overview
usersRoute.get("/lastUsersOverview", userController.retrieveNewUsers);

// User public info
usersRoute.get("/userPublic/:userId", (req, res) => {
	res.json({
		message: `User ${req.params.userId} public page`,
	});
});

module.exports = usersRoute;
