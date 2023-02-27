/**
 * User me route
 */

const meRoute = require("express").Router();
const userController = require("../../controllers/user.controller");

meRoute.get("/", userController.getUser).put("/", userController.updateUser);

module.exports = meRoute;
