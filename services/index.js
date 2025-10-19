// Authentication Services
module.exports.signupService = require("./auth/signup.service");
module.exports.loginService = require("./auth/login.service");

//User Services
module.exports.userService = require("./user/user.service");
module.exports.talentService = require("./user/talent.service");
module.exports.adminService = require("./user/admin.service");

// Token Services
module.exports.generateTokenService = require("./token/generateToken.service");
module.exports.storeTokenService = require("./token/storeToken.service");
module.exports.verifyTokenService = require("./token/verifyToken.service");
module.exports.removeTokenService = require("./token/removeToken.service");

// Email services
module.exports.emailService = require("./email.service");

// Project related services
module.exports.categoryService = require("./project/category.service");
module.exports.tagService = require("./project/tag.service");
module.exports.projectService = require("./project/project.service");
module.exports.userRightsService = require("./project/userRights.service");
module.exports.memberService = require("./project/member.service");
module.exports.attachmentService = require("./project/attachment.service");
module.exports.joinProjectService = require("./project/joinProject.service");
module.exports.statusService = require("./project/status.service");
module.exports.crushService = require("./project/crush.service");
module.exports.likeProjectService = require("./project/likeProject.service");
module.exports.projectStepQAService = require("./project/projectStepQA.service");
module.exports.commentService = require("./project/comment.service");

// Upload services
module.exports.uploadService = require("./upload.service");
