/**
 * Remove project category route
 */

const removeCategoryRoute = require("express").Router();
const { categoryController } = require("../../controllers");

removeCategoryRoute.delete("/", categoryController.removeCategory);

module.exports = removeCategoryRoute;
