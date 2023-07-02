/**
 * Signup route
 */

const signupRoute = require("express").Router();
const authController = require("../../controllers/auth/auth.controller");

signupRoute.post("/", authController.signup);

module.exports = signupRoute;
