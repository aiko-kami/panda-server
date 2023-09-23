/**
 * Project routes
 */

const projectRoute = require("express").Router();

const { projectController, memberController, categoryController, projectRightsController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Project creation
projectRoute.post("/project", verifyAccess, projectController.createProject);
projectRoute.post("/project/submit/:projectId", projectController.createProject);

// Project update
projectRoute.patch("/project/:projectId", verifyAccess, projectController.updateProject);
projectRoute.patch("/project/status/:projectId", verifyAccess, projectController.updateProjectStatus);
projectRoute.patch("/project/attachments/:projectId", verifyAccess, projectController.updateProjectAttachments);
projectRoute.patch("/project/UserRights/:projectId", verifyAccess, projectRightsController.updateUserProjectRights);
projectRoute.patch("/project/members/update/:projectId", verifyAccess, memberController.updateProjectMember);
projectRoute.patch("/project/members/remove/:projectId", verifyAccess, memberController.removeProjectMember);

// Retrieve project data
projectRoute.get("/project/:projectId", projectController.retrieveProjectData);
projectRoute.get("/projectOverview/:projectId", projectController.retrieveProjectOverview);
projectRoute.get("/projectPublic/:projectId", projectController.retrieveProjectPublicData);

// Categories
projectRoute.get("/category", categoryController.retrieveCategory);
projectRoute.get("/categories", categoryController.retrieveCategories);
projectRoute.post("/category", categoryController.createCategory);
projectRoute.patch("/category", categoryController.updateCategory);
projectRoute.delete("/category", categoryController.removeCategory);

// Sub-categories
projectRoute.post("/subCategory", categoryController.addSubCategory);
projectRoute.patch("/subCategory", categoryController.updateSubCategory);
projectRoute.delete("/subCategory", categoryController.removeSubCategory);

module.exports = projectRoute;
