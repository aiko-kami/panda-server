/**
 * Index route
 */

const indexRouter = require("express").Router();

indexRouter.get("/", (req, res) => {
	res.json({
		message: "Welcome to Panda-01 application.",
	});
});

module.exports = indexRouter;
