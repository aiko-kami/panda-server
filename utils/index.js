// Validation
module.exports.authValidation = require("./validation/auth.validation");
module.exports.categoryValidation = require("./validation/category.validation");
module.exports.projectValidation = require("./validation/project.validation");
module.exports.memberValidation = require("./validation/member.validation");
module.exports.joinProjectValidation = require("./validation/joinProject.validation");
module.exports.statusValidation = require("./validation/status.validation");
module.exports.projectRightsValidation = require("./validation/projectRights.validation");
module.exports.userValidation = require("./validation/user.validation");
module.exports.talentValidation = require("./validation/talent.validation");
module.exports.idsValidation = require("./validation/ids.validation");
module.exports.stringValidation = require("./validation/string.validation");

// Tools
module.exports.filterTools = require("./tools/filter.tools");
module.exports.idTools = require("./tools/id.tools");
module.exports.statusTools = require("./tools/status.tools");
module.exports.encryptTools = require("./tools/encrypt.tools");

// Queries
module.exports.aggregateQueries = require("./queries/aggregateQueries");

// Others
module.exports.apiResponse = require("./apiResponse");
module.exports.emailDelivery = require("./email/emailDelivery");
module.exports.emailTemplates = require("./email/emailtemplates");
module.exports.logger = require("./logger");
module.exports.uploadFiles = require("./filesUpload/uploadFiles");
