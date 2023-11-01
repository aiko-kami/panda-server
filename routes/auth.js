/**
 * Authentification routes
 */

const authRoute = require("express").Router();

const { signupController, loginController, logoutController, forgotPasswordController, deleteAllTokensController } = require("../controllers");
const { verifyAccess, verifyAdminAccess } = require("../middlewares/verifyAccess.middleware");

// Sign-up
authRoute.post("/sign-up", signupController.signup);
authRoute.get("/sign-up/:emailValidationId", signupController.verifyEmailLink);

// Login
authRoute.post("/login", loginController.login);

// Admin login
authRoute.post("/adminLogin", loginController.adminLogin);

// Logout
authRoute.post("/logout", verifyAccess, logoutController.logout);

// Forgot password
authRoute.post("/forgotPassword", forgotPasswordController.forgotPassword);
authRoute.post("/forgotPassword/reset/:resetPasswordId", forgotPasswordController.resetPassword);

// Delete all tokens
authRoute.delete("/deleteAllTokens", verifyAdminAccess, deleteAllTokensController.deleteAllTokens);

module.exports = authRoute;
