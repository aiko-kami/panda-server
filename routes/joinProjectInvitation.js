/**
 * Join project invitation routes
 */

const joinProjectRoute = require("express").Router();

const { joinProjectInvitationController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Join Project Invitation
joinProjectRoute.post("/saveDraft", verifyAccess, joinProjectInvitationController.saveDraftInvitation);
joinProjectRoute.patch("/updateDraft", verifyAccess, joinProjectInvitationController.updateDraftInvitation);
joinProjectRoute.delete("/removeDraft", verifyAccess, joinProjectInvitationController.removeDraftInvitation);
joinProjectRoute.post("/send", verifyAccess, joinProjectInvitationController.sendInvitation);
joinProjectRoute.patch("/cancel", verifyAccess, joinProjectInvitationController.cancelInvitation);
joinProjectRoute.post("/accept", verifyAccess, joinProjectInvitationController.acceptInvitation);
joinProjectRoute.post("/refuse", verifyAccess, joinProjectInvitationController.refuseInvitation);

joinProjectRoute.get("/drafts", verifyAccess, joinProjectInvitationController.retrieveDraftsInvitations);
joinProjectRoute.get("/draft/:draftId", verifyAccess, joinProjectInvitationController.retrieveDraftInvitation);
joinProjectRoute.get("/all", verifyAccess, joinProjectInvitationController.retrieveAllInvitations);
joinProjectRoute.get("/:requestId", verifyAccess, joinProjectInvitationController.retrieveInvitation);

module.exports = joinProjectRoute;
