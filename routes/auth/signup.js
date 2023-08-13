/**
 * Sign-up route
 */

const signupRoute = require("express").Router();
const { signupController } = require("../../controllers");

signupRoute.post("/", signupController.signup);
signupRoute.get("/:emailValidationId", signupController.verifyEmailLink);

module.exports = signupRoute;
