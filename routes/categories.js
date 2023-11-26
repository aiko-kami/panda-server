/**
 * Project routes
 */

const projectRoute = require("express").Router();

const { categoryController } = require("../controllers");
const { verifyAdminAccess } = require("../middlewares/verifyAccess.middleware");

// Categories
projectRoute.get("/category", verifyAdminAccess, categoryController.retrieveCategory);
projectRoute.get("/categories", verifyAdminAccess, categoryController.retrieveCategories);
projectRoute.post("/category", verifyAdminAccess, categoryController.createCategory);
projectRoute.patch("/category", verifyAdminAccess, categoryController.updateCategory);
projectRoute.delete("/category", verifyAdminAccess, categoryController.removeCategory);

// Sub-categories
projectRoute.post("/subCategory", verifyAdminAccess, categoryController.addSubCategory);
projectRoute.patch("/subCategory", verifyAdminAccess, categoryController.updateSubCategory);
projectRoute.delete("/subCategory", verifyAdminAccess, categoryController.removeSubCategory);

module.exports = categoriesRoute;
