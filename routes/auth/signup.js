/**
 * Signup route
 */

const signupRoute = require("express").Router();
const signupController = require("../../controllers");

signupRoute.post("/", signupController.signup);

module.exports = signupRoute;
