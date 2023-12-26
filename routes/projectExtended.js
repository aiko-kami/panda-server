/**
 * Project extended routes
 */

const projectRoute = require("express").Router();

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
projectRoute.patch("/addProjectCrush", verifyAdminAccess, projectCrushController.addCrush);
projectRoute.patch("/removeProjectCrush", verifyAdminAccess, projectCrushController.removeCrush);
projectRoute.get("/crushProjects", projectCrushController.retrieveCrushProjects);

// Project like
projectRoute.patch("/likeProject", verifyAccess, projectLikeController.likeProject);
projectRoute.patch("/unlikeProject", verifyAccess, projectLikeController.unlikeProject);
projectRoute.get("/projectsUserLikes", verifyAccess, projectLikeController.retrieveUserLikes);
projectRoute.get("/projectLikes", projectLikeController.retrieveProjectLikes);

// Project steps
projectRoute.patch("/addProjectSteps", verifyAccess, projectStepsController.addSteps);
projectRoute.patch("/editProjectSteps", verifyAccess, projectStepsController.editSteps);
projectRoute.patch("/publishProjectStep", verifyAccess, projectStepsController.publishStep);
projectRoute.patch("/unpublishProjectStep", verifyAccess, projectStepsController.unpublishStep);
projectRoute.delete("/removeProjectStep", verifyAccess, projectStepsController.removeStep);
projectRoute.get("/projectStepsPublished", projectStepsController.retrieveProjectStepsPublished);
projectRoute.get("/projectStepsAll", verifyAccess, projectStepsController.retrieveProjectStepsAll);

// Project Q and A
projectRoute.patch("/addProjectQAs", verifyAccess, projectQAController.addQAs);
projectRoute.patch("/editProjectQAs", verifyAccess, projectQAController.editQAs);
projectRoute.patch("/publishProjectQA", verifyAccess, projectQAController.publishQA);
projectRoute.patch("/unpublishProjectQA", verifyAccess, projectQAController.unpublishQA);
projectRoute.delete("/removeProjectQA", verifyAccess, projectQAController.removeQA);
projectRoute.get("/projectQAsPublished", projectQAController.retrieveProjectQAsPublished);
projectRoute.get("/projectQAsAll", verifyAccess, projectQAController.retrieveProjectQAsAll);

// Project comments
projectRoute.post("/addProjectComment", verifyAccess, commentController.addComment);
projectRoute.patch("/answerProjectComment", verifyAccess, commentController.answerComment);
projectRoute.patch("/editProjectComment", verifyAccess, commentController.editComment);
projectRoute.delete("/removeProjectComment", verifyAccess, commentController.removeComment);
projectRoute.get("/projectComments", commentController.retrieveProjectComments);

// User's rights
projectRoute.patch("/projectUserRights/:projectId", verifyAccess, projectRightsController.updateUserProjectRights);

// Project members
projectRoute.patch("/projectMembers/update/:projectId", verifyAccess, memberController.updateProjectMember);
projectRoute.delete("/projectMembers/remove/:projectId", verifyAccess, memberController.removeProjectMember);

// Project status
projectRoute.patch("/projectStatus/:projectId", verifyAccess, projectStatusController.updateProjectStatus);

// Project attachments
projectRoute.patch("/projectAttachments/:projectId", verifyAccess, projectAttachmentsController.updateProjectAttachments);

module.exports = projectRoute;
