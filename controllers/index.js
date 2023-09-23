/**
 * Controllers
 * This module exports the controllers for handling the routes and associated actions.
 */

// User Controllers
module.exports.userController = require("./user/user.controller");

// Project Controllers
module.exports.projectController = require("./project/project.controller");
module.exports.projectRightsController = require("./project/projectRights.controller");
module.exports.categoryController = require("./project/category.controller");
module.exports.memberController = require("./project/member.controller");

// Auth Controllers
module.exports.signupController = require("./auth/signup.controller");
module.exports.loginController = require("./auth/login.controller");
module.exports.logoutController = require("./auth/logout.controller");
module.exports.forgotPasswordController = require("./auth/forgotPassword.controller");
module.exports.deleteAllTokensController = require("./auth/deleteAllTokens.controller");
