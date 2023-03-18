/**
 * Login route
 */

const loginRoute = require("express").Router();
const userController = require("../../controllers/user/user.controller");

loginRoute.post("/", userController.loginUser);

module.exports = loginRoute;
