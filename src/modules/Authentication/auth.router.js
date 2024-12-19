const express = require("express");
const router = express.Router();
const { login, protect } = require("./auth.controller");

router.post("/login", login);
module.exports = router;
