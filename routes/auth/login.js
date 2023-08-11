/**
 * Login route
 */

const loginRoute = require("express").Router();
const { loginController } = require("../../controllers");
const { verifyAccessTokenForLoginMDW } = require("../../middlewares/verifyAccessToken.middleware");

loginRoute.post("/", loginController.login);

module.exports = loginRoute;
