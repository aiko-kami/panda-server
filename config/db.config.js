const mongoose = require("mongoose");

// Winston manual logger
const { logger } = require("../utils");

// Replace the database URL and options with your actual database configuration
const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const dbConnectionPrivate = mongoose.createConnection(process.env.MONGODB_URI_PRIVATE, dbOptions);
logger.info(`Connected to ${process.env.DB_PUBLIC} database`);

const dbConnectionPublic = mongoose.createConnection(process.env.MONGODB_URI_PUBLIC, dbOptions);
logger.info(`Connected to ${process.env.DB_PRIVATE} database`);

const dbConnectionSecure = mongoose.createConnection(process.env.MONGODB_URI_SECURE, dbOptions);
logger.info(`Connected to ${process.env.DB_SECURE} database`);

module.exports = { dbConnectionPrivate, dbConnectionPublic, dbConnectionSecure };
