/**
 * deleteAllTokens route
 */

const deleteAllTokensRoute = require("express").Router();
const { deleteAllTokensController } = require("../../controllers");

deleteAllTokensRoute.delete("/", deleteAllTokensController.deleteAllTokens);

module.exports = deleteAllTokensRoute;
