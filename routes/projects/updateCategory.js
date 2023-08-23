/**
 * Update project category route
 */

const updateCategoryRoute = require("express").Router();
const { categoryController } = require("../../controllers");

updateCategoryRoute.post("/", categoryController.updateCategory);

module.exports = updateCategoryRoute;
