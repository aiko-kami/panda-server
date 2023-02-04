const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
require("dotenv").config();

const app = express();

//Setting up CORS to allow frontend to target backend
var corsOptions = {
	//Domain and port from frontend allowed to access the server
	origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
	cookieSession({
		name: "panda01-session",
		secret: process.env.COOKIE_SECRET, // should use as secret environment variable
		httpOnly: true,
	})
);

app.use(require("./routes"));

// routes
// require("./app/routes/auth.routes")(app);
// require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
	console.log(`open http://localhost:${PORT}`);
});
