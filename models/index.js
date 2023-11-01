const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

//Import user model
db.User = require("./user.model");
db.AdminUser = require("./admin.model");

//Import project related model
db.Project = require("./project.model");
db.Category = require("./category.model");
db.ProjectRights = require("./projectRights.model");
db.JoinProject = require("./joinProject.model");
db.CrushProject = require("./crushProject.model");

//Import tokens models
const tokenModels = require("./token.model");
db.RefreshToken = tokenModels.RefreshToken;
db.ResetPasswordToken = tokenModels.ResetPasswordToken;

module.exports = db;
