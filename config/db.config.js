const mongoose = require("mongoose");

// Winston manual logger
const { logger } = require("../utils");

const dbConnectionPrivate = mongoose.createConnection(process.env.MONGODB_URI_PRIVATE);
logger.info(`Connected to ${process.env.DB_PUBLIC} database`);

const dbConnectionPublic = mongoose.createConnection(process.env.MONGODB_URI_PUBLIC);
logger.info(`Connected to ${process.env.DB_PRIVATE} database`);

const dbConnectionSecure = mongoose.createConnection(process.env.MONGODB_URI_SECURE);
logger.info(`Connected to ${process.env.DB_SECURE} database`);

module.exports = { dbConnectionPrivate, dbConnectionPublic, dbConnectionSecure };
