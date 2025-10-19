/**
 * Tags routes
 */

const tagsRoute = require("express").Router();

const { tagController } = require("../controllers");
const { verifyAdminAccess } = require("../middlewares/verifyAccess.middleware");

// Tags
tagsRoute.get("/tag/id/:tagId", tagController.retrieveTagWithId);
tagsRoute.get("/tag/link/:tagLink", tagController.retrieveTagWithLink);
tagsRoute.get("/tags", tagController.retrieveTags);

// Tags admin
tagsRoute.post("/tag", tagController.createTag);
tagsRoute.post("/tags", tagController.createTags);
tagsRoute.patch("/tag", tagController.updateTag);
tagsRoute.delete("/tag", tagController.removeTag);

module.exports = tagsRoute;
