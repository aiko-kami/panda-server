/**
 * Project routes
 */

const projectRoute = require("express").Router();

const { projectController, memberController, categoryController, projectRightsController, projectAttachmentsController, projectStatusController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Project creation
projectRoute.post("/project/createDraft", verifyAccess, projectController.createProject);
projectRoute.post("/project/updateDraft/:projectId", verifyAccess, projectController.createProject);
projectRoute.post("/project", verifyAccess, projectController.createProject);
projectRoute.post("/project/submit/:projectId", projectController.createProject);

// Project update
projectRoute.patch("/project/:projectId", verifyAccess, projectController.updateProject);

// Retrieve project data
projectRoute.get("/project/:projectId", projectController.retrieveProjectData);
projectRoute.get("/projectOverview/:projectId", projectController.retrieveProjectOverview);
projectRoute.get("/projectPublic/:projectId", projectController.retrieveProjectPublicData);
projectRoute.get("/lastProjectsOverview", projectController.retrieveProjectPublicData);

// Count projects
projectRoute.get("/nbProjects", projectController.countProjects);
projectRoute.get("/nbProjectsPerCategory", projectController.countProjectsPerCategory);

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

// User's rights
projectRoute.patch("/project/UserRights/:projectId", verifyAccess, projectRightsController.updateUserProjectRights);

// Project members
projectRoute.patch("/project/members/update/:projectId", verifyAccess, memberController.updateProjectMember);
projectRoute.delete("/project/members/remove/:projectId", verifyAccess, memberController.removeProjectMember);

//Project status
projectRoute.patch("/project/status/:projectId", verifyAccess, projectStatusController.updateProjectStatus);

//Project attachments
projectRoute.patch("/project/attachments/:projectId", verifyAccess, projectAttachmentsController.updateProjectAttachments);

module.exports = projectRoute;
