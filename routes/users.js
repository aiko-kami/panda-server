/**
 * Users routes
 */

const usersRoute = require("express").Router();

const { userController } = require("../controllers");

// Me
usersRoute.get("/me", userController.getMyUserData);
usersRoute.put("/me", userController.updateUser);

// User overview
usersRoute.get("/userOverview/:userId", (req, res) => {
	res.json({
		message: `User ${req.params.userId} overview page`,
	});
});

// New User Overview
usersRoute.get("/lastUsersOverview", userController.getNewUsers);

// User public info
usersRoute.get("/userPublic/:userId", (req, res) => {
	res.json({
		message: `User ${req.params.userId} public page`,
	});
});

module.exports = usersRoute;
