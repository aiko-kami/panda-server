const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
var colors = require("colors");
require("dotenv").config();

const app = express();

const morganMiddleware = require("./middlewares/morgan.middleware");

// The morgan middleware does not need this.
// This is for a manual log
const logger = require("./utils/logger");

// Morgan middleware for HTTP requests and errors logging
app.use(morganMiddleware);

//Setting up CORS to allow frontend to target backend
var corsOptions = {
	//Domain and port from frontend allowed to access the server
	origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
	cookieSession({
		name: "panda01-session",
		secret: process.env.COOKIE_SECRET, // should use as secret environment variable
		httpOnly: true,
	})
);

// All routes
app.use(require("./routes"));

// Set port, listening for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	logger.info("Panda-Server ".rainbow + `is running on port ${PORT}`.magenta);
	console.log(
		"Open ".magenta +
			`http://localhost:${PORT}`.underline.italic.brightBlue +
			" to access the server".magenta
	);
});
