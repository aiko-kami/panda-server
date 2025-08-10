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
const allowedOrigins = ["https://sheepy.vercel.app", "https://www.neutroneer.com", "https://neutroneer.com", "https://www.sheepy.neutroneer.com", "https://sheepy.neutroneer.com"];

// CORS options
const corsOptions = {
	origin: function (origin, callback) {
		if (isDevelopment) {
			// Allow all origins in development
			callback(null, true);
		} else {
			// Only allow specific origins in production
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		}
	},
	credentials: true, // Allow credentials (cookies, auth headers)
	exposedHeaders: ["set-cookie"],
	methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
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
