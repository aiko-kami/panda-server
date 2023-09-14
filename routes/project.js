/**
 * Project routes
 */

const projectRoute = require("express").Router();

const {
	projectController,
	categoryController,
	projectRightsController,
} = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

projectRoute.post("/project", verifyAccess, projectController.createProject);
projectRoute.post("/project/submit/:projectId", projectController.createProject);

projectRoute.patch("/project/:projectId", verifyAccess, projectController.updateProject);
projectRoute.patch(
	"/project/status/:projectId",
	verifyAccess,
	projectController.updateProjectStatus
);
projectRoute.patch(
	"/project/members/add/:projectId",
	verifyAccess,
	projectController.addProjectMember
);
projectRoute.patch(
	"/project/members/remove/:projectId",
	verifyAccess,
	projectController.removeProjectMember
);
projectRoute.patch(
	"/project/attachments/:projectId",
	verifyAccess,
	projectController.updateProjectAttachments
);
projectRoute.patch(
	"/project/UserRights/:projectId",
	verifyAccess,
	projectRightsController.updateUserProjectRights
);

projectRoute.get("/project/:projectId", projectController.createProject);
projectRoute.get("/projectOverview/:projectId", projectController.createProject);
projectRoute.get("/projectPublic/:projectId", projectController.createProject);

projectRoute.post("/category", categoryController.createCategory);
projectRoute.patch("/category", categoryController.updateCategory);
projectRoute.delete("/category", categoryController.removeCategory);

projectRoute.post("/subCategory", categoryController.addSubCategory);
projectRoute.patch("/subCategory", categoryController.updateSubCategory);
projectRoute.delete("/subCategory", categoryController.removeSubCategory);

module.exports = projectRoute;
