/**
 * Create project route
 */

const createProjectRoute = require("express").Router();

createProjectRoute.post("/", (req, res) => {
	res.json({
		message: "Create Project page",
	});
});

module.exports = createProjectRoute;
