/**
 * Project extended routes
 */

const projectExtendedRoute = require("express").Router();

const {
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

// Project crush
projectExtendedRoute.patch("/addProjectCrush", verifyAdminAccess, projectCrushController.addCrush);
projectExtendedRoute.patch("/removeProjectCrush", verifyAdminAccess, projectCrushController.removeCrush);
projectExtendedRoute.get("/crushProjects", projectCrushController.retrieveCrushProjects);

// Project like
projectExtendedRoute.patch("/likeProject", verifyAccess, projectLikeController.likeProject);
projectExtendedRoute.patch("/unlikeProject", verifyAccess, projectLikeController.unlikeProject);
projectExtendedRoute.get("/projectsUserPublicLikes", verifyAccess, projectLikeController.retrieveUserPublicLikes);
projectExtendedRoute.get("/projectsUserPrivateLikes", verifyAccess, projectLikeController.retrieveUserPrivateLikes);
projectExtendedRoute.get("/projectLikes", projectLikeController.retrieveProjectLikes);

// Project steps
projectExtendedRoute.patch("/addProjectSteps", verifyAccess, projectStepsController.addSteps);
projectExtendedRoute.patch("/editProjectSteps", verifyAccess, projectStepsController.editSteps);
projectExtendedRoute.patch("/publishProjectStep", verifyAccess, projectStepsController.publishStep);
projectExtendedRoute.patch("/unpublishProjectStep", verifyAccess, projectStepsController.unpublishStep);
projectExtendedRoute.delete("/removeProjectStep", verifyAccess, projectStepsController.removeStep);
projectExtendedRoute.get("/projectStepsPublished", projectStepsController.retrieveProjectStepsPublished);
projectExtendedRoute.get("/projectStepsAll", verifyAccess, projectStepsController.retrieveProjectStepsAll);

// Project Q and A
projectExtendedRoute.patch("/addProjectQAs", verifyAccess, projectQAController.addQAs);
projectExtendedRoute.patch("/editProjectQAs", verifyAccess, projectQAController.editQAs);
projectExtendedRoute.patch("/publishProjectQA", verifyAccess, projectQAController.publishQA);
projectExtendedRoute.patch("/unpublishProjectQA", verifyAccess, projectQAController.unpublishQA);
projectExtendedRoute.delete("/removeProjectQA", verifyAccess, projectQAController.removeQA);
projectExtendedRoute.get("/projectQAsPublished", projectQAController.retrieveProjectQAsPublished);
projectExtendedRoute.get("/projectQAsAll", verifyAccess, projectQAController.retrieveProjectQAsAll);

// Project comments
projectExtendedRoute.post("/addProjectComment", verifyAccess, commentController.addComment);
projectExtendedRoute.post("/answerProjectComment", verifyAccess, commentController.answerComment);
projectExtendedRoute.patch("/editProjectComment", verifyAccess, commentController.editComment);
projectExtendedRoute.patch("/reportProjectComment", verifyAccess, commentController.reportComment);
projectExtendedRoute.patch("/unreportProjectComment", verifyAccess, commentController.unreportComment);
projectExtendedRoute.delete("/removeProjectComment", verifyAccess, commentController.removeComment);
projectExtendedRoute.get("/projectComments", commentController.retrieveProjectComments);

// User's rights
projectExtendedRoute.patch("/projectUserRights/:projectId", verifyAccess, projectRightsController.updateUserProjectRights);

// Project members
projectExtendedRoute.patch("/projectMembers/update/:projectId", verifyAccess, memberController.updateProjectMember);
projectExtendedRoute.delete("/projectMembers/remove/:projectId", verifyAccess, memberController.removeProjectMember);

// Project status
projectExtendedRoute.patch("/projectStatus/:projectId", verifyAccess, projectStatusController.updateProjectStatus);
projectExtendedRoute.get("/projectStatus/:projectId", verifyAccess, projectStatusController.retrieveProjectStatusInfo);

// Project attachments
projectExtendedRoute.patch("/projectAttachments/:projectId", verifyAccess, projectAttachmentsController.updateProjectAttachments);

module.exports = projectExtendedRoute;
