const { randomBytes } = require("node:crypto");

console.log(randomBytes(64).toString("hex"));
