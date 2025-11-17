/**
 * Controllers
 * This module exports the controllers for handling the routes and associated actions.
 */

// User Controllers
module.exports.userController = require("./user/user.controller");
module.exports.talentController = require("./user/talent.controller");

// Project Controllers
module.exports.projectController = require("./project/project.controller");
module.exports.projectEditionController = require("./project/projectEdition.controller");
module.exports.projectRightsController = require("./project/projectRights.controller");
module.exports.statusController = require("./project/status.controller");
module.exports.projectCrushController = require("./project/projectCrush.controller");
module.exports.projectCoverController = require("./project/projectCover.controller");
module.exports.projectLikeController = require("./project/projectLike.controller");
module.exports.projectStepsController = require("./project/projectSteps.controller");
module.exports.projectQAController = require("./project/projectQA.controller");
module.exports.commentController = require("./project/comment.controller");
module.exports.projectAttachmentsController = require("./project/projectAttachments.controller");
module.exports.categoryController = require("./project/category.controller");
module.exports.tagController = require("./project/tag.controller");
module.exports.memberController = require("./project/member.controller");
module.exports.joinProjectRequestController = require("./project/joinProjectRequest.controller");
module.exports.joinProjectInvitationController = require("./project/joinProjectInvitation.controller");

// Auth Controllers
module.exports.signupController = require("./auth/signup.controller");
module.exports.loginController = require("./auth/login.controller");
module.exports.logoutController = require("./auth/logout.controller");
module.exports.forgotPasswordController = require("./auth/forgotPassword.controller");
module.exports.deleteAllTokensController = require("./auth/deleteAllTokens.controller");
