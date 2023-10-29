const mongoose = require("mongoose");

// Replace the database URL and options with your actual database configuration
const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const dbConnectionPrivate = mongoose.createConnection(process.env.MONGODB_URI_PRIVATE, dbOptions);
const dbConnectionPublic = mongoose.createConnection(process.env.MONGODB_URI_PUBLIC, dbOptions);
const dbConnectionAdmin = mongoose.createConnection(process.env.MONGODB_URI_ADMIN, dbOptions);

module.exports = { dbConnectionPrivate, dbConnectionPublic, dbConnectionAdmin };
