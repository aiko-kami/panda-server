// Authentication Services
module.exports.signupService = require("./signup.service");
module.exports.loginService = require("./login.service");

//User Services
module.exports.userService = require("./user/user.service");
module.exports.updateUserPasswordService = require("./user/updateUserPassword.service");

// Token Services
module.exports.generateTokenService = require("./token/generateToken.service");
module.exports.storeTokenService = require("./token/storeToken.service");
module.exports.verifyTokenService = require("./token/verifyToken.service");
module.exports.removeTokenService = require("./token/removeToken.service");

// Email services
module.exports.emailValidationService = require("./emailValidation.service");
module.exports.emailResetPasswordService = require("./emailResetPassword.service");
