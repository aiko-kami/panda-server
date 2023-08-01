/**
 * Signup route
 */

const signupRoute = require("express").Router();
const { signupController } = require("../../controllers");

signupRoute.post("/", signupController.signup);
signupRoute.post("/:emailValidationId", signupController.verifyEmail);

module.exports = signupRoute;
