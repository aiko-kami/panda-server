/**
 * Authentification routes
 */

const authRoute = require("express").Router();

const {
	signupController,
	loginController,
	logoutController,
	forgotPasswordController,
	deleteAllTokensController,
} = require("../controllers");

// Sign-up
authRoute.post("/sign-up", signupController.signup);
authRoute.get("/sign-up/:emailValidationId", signupController.verifyEmailLink);

// Login
authRoute.post("/login", loginController.login);

// Logout
authRoute.get("/logout", logoutController.logout);

// Forgot password
authRoute.post("/forgotPassword", forgotPasswordController.forgotPassword);
authRoute.post("/forgotPassword/reset/:resetPasswordId", forgotPasswordController.resetPassword);

// Delete all tokens
authRoute.delete("/deleteAllTokens", deleteAllTokensController.deleteAllTokens);

module.exports = authRoute;
