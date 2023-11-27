/**
 * Categories routes
 */

const categoriesRoute = require("express").Router();

const { categoryController } = require("../controllers");
const { verifyAdminAccess } = require("../middlewares/verifyAccess.middleware");

// Categories
categoriesRoute.get("/category", verifyAdminAccess, categoryController.retrieveCategory);
categoriesRoute.get("/categories", verifyAdminAccess, categoryController.retrieveCategories);
categoriesRoute.post("/category", verifyAdminAccess, categoryController.createCategory);
categoriesRoute.patch("/category", verifyAdminAccess, categoryController.updateCategory);
categoriesRoute.delete("/category", verifyAdminAccess, categoryController.removeCategory);

// Sub-categories
categoriesRoute.post("/subCategory", verifyAdminAccess, categoryController.addSubCategory);
categoriesRoute.patch("/subCategory", verifyAdminAccess, categoryController.updateSubCategory);
categoriesRoute.delete("/subCategory", verifyAdminAccess, categoryController.removeSubCategory);

module.exports = categoriesRoute;
