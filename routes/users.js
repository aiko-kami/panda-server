/**
 * Users routes
 */

const usersRoute = require("express").Router();

const { userController, talentController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Me
usersRoute.get("/myData", verifyAccess, userController.retrieveMyUserData);
usersRoute.get("/mySettings", verifyAccess, userController.retrieveMyUserSettings);
usersRoute.get("/myProjects", verifyAccess, userController.retrieveUserPrivateProjects);
usersRoute.get("/myPrivacySettings", verifyAccess, userController.retrieveMyUserPrivacySettings);
usersRoute.patch("/updateMyData", verifyAccess, userController.updateUser);
usersRoute.patch("/updateMyBioDescription", verifyAccess, userController.updateUserBioDescription);
usersRoute.patch("/updateMyDetails", verifyAccess, userController.updateUserDetails);
usersRoute.patch("/updateMySettingsPrivacy", verifyAccess, userController.updateUserSettingsPrivacy);
usersRoute.patch("/updateMySettingsAppearance", verifyAccess, userController.updateUserSettingsAppearance);
usersRoute.patch("/updateMySettingsDisplayMode", verifyAccess, userController.updateUserSettingsDisplayMode);
usersRoute.patch("/updateMySettingsLanguage", verifyAccess, userController.updateUserSettingsLanguage);
usersRoute.patch("/updateMySettingsNotifications", verifyAccess, userController.updateUserSettingsNotifications);

// User profile picture and background picture
usersRoute.post("/updateMyPicture", verifyAccess, userController.updateUserPicture);
usersRoute.post("/updateMyBackgroundPicture", verifyAccess, userController.updateUserBackgroundPicture);
usersRoute.delete("/removeMyPicture", verifyAccess, userController.removeUserPicture);
usersRoute.delete("/removeMyBackgroundPicture", verifyAccess, userController.removeUserBackgroundPicture);

// Talents
usersRoute.post("/talent/addTalent", verifyAccess, talentController.createTalent);
usersRoute.patch("/talent/updateTalent", verifyAccess, talentController.updateTalent);
usersRoute.patch("/talent/updateTalents", verifyAccess, talentController.updateTalents);
usersRoute.delete("/talent/removeTalent", verifyAccess, talentController.removeTalent);

// Quick Skills
usersRoute.post("/skill", verifyAccess, talentController.addQuickSkill);
usersRoute.delete("/skill", verifyAccess, talentController.removeQuickSkill);

// Change email
usersRoute.patch("/changeMyEmail", verifyAccess, userController.updateUserEmail);
usersRoute.get("/changeMyEmail/:emailChangeValidationId", userController.verifyEmailChangeLink);

// Change password
usersRoute.patch("/changeMyPassword", verifyAccess, userController.updateUserPassword);

// New User Overview
usersRoute.get("/lastUsersOverview", userController.retrieveNewUsers);

// User overview
usersRoute.get("/userOverview/:userId", userController.retrieveUserOverview);

// User public info
usersRoute.get("/userPublic/:userId", userController.retrieveUserPublicData);

module.exports = usersRoute;
