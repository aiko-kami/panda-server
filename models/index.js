const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

//Import user model
db.User = require("./user.model");

//Import project related model
db.Project = require("./project.model");
db.Category = require("./category.model");

//Import tokens models
const tokenModels = require("./token.model");
db.RefreshToken = tokenModels.RefreshToken;
db.ResetPasswordToken = tokenModels.ResetPasswordToken;

module.exports = db;
