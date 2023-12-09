/**
 * Project routes
 */

const projectRoute = require("express").Router();

const {
	projectController,
	memberController,
	projectRightsController,
	projectAttachmentsController,
	projectStatusController,
	projectCrushController,
	projectLikeController,
	projectStepsController,
	projectQAController,
	commentController,
} = require("../controllers");
const { verifyAccess, verifyAdminAccess } = require("../middlewares/verifyAccess.middleware");

// Project creation
projectRoute.post("/project/createDraft", verifyAccess, projectController.createProject);
projectRoute.post("/project/updateDraft/:projectId", verifyAccess, projectController.createProject);
projectRoute.post("/project/create", verifyAccess, projectController.createProject);

// Project update
projectRoute.patch("/project/update/:projectId", verifyAccess, projectController.updateProject);

// Retrieve project data
projectRoute.get("/projectData/:projectId", verifyAccess, projectController.retrieveProjectData);
projectRoute.get("/projectOverview/:projectId", projectController.retrieveProjectOverview);
projectRoute.get("/projectPublic/:projectId", projectController.retrieveProjectPublicData);
projectRoute.get("/lastProjectsOverview", projectController.retrieveNewProjects);

// Count projects
projectRoute.get("/nbProjects", projectController.countProjects);
projectRoute.get("/nbProjectsPerCategory", projectController.countProjectsPerCategory);

// Project crush
projectRoute.patch("/project/addCrush", verifyAdminAccess, projectCrushController.addCrush);
projectRoute.patch("/project/removeCrush", verifyAdminAccess, projectCrushController.removeCrush);
projectRoute.get("/crushProjects", projectCrushController.retrieveCrushProjects);

// Project like
projectRoute.patch("/project/like", verifyAccess, projectLikeController.likeProject);
projectRoute.patch("/project/unlike", verifyAccess, projectLikeController.unlikeProject);
projectRoute.get("/projectsUserLikes", verifyAccess, projectLikeController.retrieveUserLikes);
projectRoute.get("/projectLikes", projectLikeController.retrieveProjectLikes);

// Project steps
projectRoute.patch("/project/addSteps", verifyAccess, projectStepsController.addSteps);
projectRoute.patch("/project/editSteps", verifyAccess, projectStepsController.editSteps);
projectRoute.patch("/project/publishStep", verifyAccess, projectStepsController.publishStep);
projectRoute.delete("/project/removeStep", verifyAccess, projectStepsController.removeStep);
projectRoute.get("/projectStepsPublished", projectStepsController.retrieveProjectStepsPublished);
projectRoute.get("/projectStepsAll", verifyAccess, projectStepsController.retrieveProjectStepsAll);

// Project Q and A
projectRoute.patch("/project/addQAs", verifyAccess, projectQAController.addQAs);
projectRoute.patch("/project/editQAs", verifyAccess, projectQAController.editQAs);
projectRoute.patch("/project/publishQA", verifyAccess, projectQAController.publishQA);
projectRoute.delete("/project/removeQA", verifyAccess, projectQAController.removeQA);
projectRoute.get("/projectQAs", projectQAController.retrieveProjectQAs);

// Project comments
projectRoute.patch("/project/addComment", verifyAccess, commentController.addComment);
projectRoute.patch("/project/editComment", verifyAccess, commentController.editComment);
projectRoute.delete("/project/removeComment", verifyAccess, commentController.removeComment);
projectRoute.get("/projectComments", commentController.retrieveProjectComments);

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
