/**
 * Users routes
 */

const usersRoute = require("express").Router();

const { userController, talentController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Me
usersRoute.get("/me", verifyAccess, userController.retrieveMyUserData);
usersRoute.patch("/updateMyData", verifyAccess, userController.updateUser);
usersRoute.post("/uploadImageFile", verifyAccess, userController.uploadAnImage);

// Talents
usersRoute.post("/me/talent/add", verifyAccess, talentController.createTalent);
usersRoute.patch("/me/talent/update", verifyAccess, talentController.updateTalent);
usersRoute.delete("/me/talent/remove", verifyAccess, talentController.removeTalent);

// Change password
usersRoute.patch("/me/changePassword", verifyAccess, userController.updateUserPassword);

// New User Overview
usersRoute.get("/lastUsersOverview", userController.retrieveNewUsers);

// User overview
usersRoute.get("/userOverview/:userId", userController.retrieveUserOverview);

// User public info
usersRoute.get("/userPublic/:userId", userController.retrieveUserPublicData);

module.exports = usersRoute;
