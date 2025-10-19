const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// Import user model
db.User = require("./user.model");
db.AdminUser = require("./admin.model");

// Import project related model
db.Category = require("./category.model");
db.Comment = require("./comment.model");
db.CrushProject = require("./crushProject.model");
db.JoinProject = require("./joinProject.model");
db.LikeProject = require("./likeProject.model");
db.Project = require("./project.model");
db.ProjectRights = require("./projectRights.model");
db.ProjectStatus = require("./projectStatus.model");
db.ProjectStepConfig = require("./projectStepConfig.model");
db.Tag = require("./tag.model");

// Import tokens models
const tokenModels = require("./token.model");
db.RefreshToken = tokenModels.RefreshToken;
db.ResetPasswordToken = tokenModels.ResetPasswordToken;

module.exports = db;
