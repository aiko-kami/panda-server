/**
 * Forgot password route
 */

const forgotPasswordRoute = require("express").Router();
const { forgotPasswordController } = require("../../controllers");

forgotPasswordRoute.post("/", forgotPasswordController.forgotPassword);
forgotPasswordRoute.post("/reset/:resetPasswordId", forgotPasswordController.resetPassword);

module.exports = forgotPasswordRoute;
