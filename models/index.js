const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

//Import user model
db.User = require("./user.model");

//Import project model
db.Project = require("./project.model");

//Import tokens models
const tokenModels = require("./token.model");
db.RefreshToken = tokenModels.RefreshToken;
db.ResetPasswordToken = tokenModels.ResetPasswordToken;

//Import role model
db.Role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
