require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const colors = require("colors");
const morganMiddleware = require("./middlewares/morgan.middleware");

const app = express();

// Set port
const PORT = process.env.PORT || 8080;

// Winston manual logger
const { logger } = require("./utils");

// Morgan middleware for HTTP requests and errors logging
app.use(morganMiddleware);

const isDevelopment = process.env.NODE_ENV === "development";

//Setting up CORS to allow frontend to target backend
const corsOptions = {
	//Domain and port from frontend allowed to access the server
	origin: true,
	credentials: true,
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cookieSession({
		name: "panda01-session",
		secret: process.env.COOKIE_SECRET, // should use as secret environment variable
		httpOnly: !isDevelopment, // Set httpOnly to true in production and to false in development
	})
);

// All routes
app.use(require("./routes"));

app.listen(PORT, () => {
	logger.info("Panda-Server ".rainbow + `is running on port ${PORT}`.magenta);
	console.log("Open ".magenta + `http://localhost:${PORT}`.underline.italic.brightBlue + " to access the server".magenta);
});

module.exports = {
	app,
};
