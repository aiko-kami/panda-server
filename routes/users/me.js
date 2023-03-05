/**
 * User me route
 */

const meRoute = require("express").Router();
const userController = require("../../controllers/user/user.controller");

meRoute.get("/", userController.getMyUserData).put("/", userController.updateUser);

module.exports = meRoute;
