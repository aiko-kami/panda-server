/**
 * Project routes
 */

const projectRoute = require("express").Router();

const { projectController, memberController, categoryController, projectRightsController, projectAttachmentsController, projectStatusController, projectCrushController } = require("../controllers");
const { verifyAccess, verifyAdminAccess } = require("../middlewares/verifyAccess.middleware");

// Project creation
projectRoute.post("/project/createDraft", verifyAccess, projectController.createProject);
projectRoute.post("/project/updateDraft/:projectId", verifyAccess, projectController.createProject);
projectRoute.post("/project/create", verifyAccess, projectController.createProject);

// Project update
projectRoute.patch("/project/update/:projectId", verifyAccess, projectController.updateProject);

// Project crush
projectRoute.patch("/project/addCrush", verifyAdminAccess, projectCrushController.addCrush);
projectRoute.patch("/project/removeCrush", verifyAdminAccess, projectCrushController.removeCrush);

// Retrieve project data
projectRoute.get("/project/:projectId", verifyAccess, projectController.retrieveProjectData);
projectRoute.get("/projectOverview/:projectId", projectController.retrieveProjectOverview);
projectRoute.get("/projectPublic/:projectId", projectController.retrieveProjectPublicData);
projectRoute.get("/lastProjectsOverview", projectController.retrieveNewProjects);

// Count projects
projectRoute.get("/nbProjects", projectController.countProjects);
projectRoute.get("/nbProjectsPerCategory", projectController.countProjectsPerCategory);

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

// User's rights
projectRoute.patch("/project/UserRights/:projectId", verifyAccess, projectRightsController.updateUserProjectRights);

// Project members
projectRoute.patch("/project/members/update/:projectId", verifyAccess, memberController.updateProjectMember);
projectRoute.delete("/project/members/remove/:projectId", verifyAccess, memberController.removeProjectMember);

// Project status
projectRoute.patch("/project/status/:projectId", verifyAccess, projectStatusController.updateProjectStatus);

// Project attachments
projectRoute.patch("/project/attachments/:projectId", verifyAccess, projectAttachmentsController.updateProjectAttachments);

module.exports = projectRoute;
