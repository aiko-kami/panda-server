/**
 * Forgot password route
 */

const forgotPasswordRoute = require("express").Router();
const { forgotPasswordController } = require("../../controllers");

forgotPasswordRoute.post("/", forgotPasswordController.forgotPassword);
forgotPasswordRoute.get("/reset/:resetPasswordId", forgotPasswordController.resetPassword);

module.exports = forgotPasswordRoute;
