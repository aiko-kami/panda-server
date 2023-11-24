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

// New User Overview
usersRoute.get("/lastUsersOverview", userController.retrieveNewUsers);

// User overview
usersRoute.get("/userOverview/:userId", userController.retrieveUserOverview);

// User public info
usersRoute.get("/userPublic/:userId", userController.retrieveUserPublicData);

module.exports = usersRoute;
