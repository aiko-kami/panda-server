/**
 * Users routes
 */

const usersRoute = require("express").Router();

const { userController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Me
usersRoute.get("/me", verifyAccess, userController.retrieveMyUserData);
usersRoute.put("/me", verifyAccess, userController.updateUser);

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
