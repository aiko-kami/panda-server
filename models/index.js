const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

//Import user model
db.user = require("./user.model");

//Import tokens models
const tokenModels = require("./token.model");
db.AccessToken = tokenModels.AccessToken;
db.RefreshToken = tokenModels.RefreshToken;

//Import role model
db.role = require("./role.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
