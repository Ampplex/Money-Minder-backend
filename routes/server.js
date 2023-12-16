const express = require("express");
const { handleActivator } = require("../controllers/server");

const router = express.Router();

router.route("/").get(handleActivator);

module.exports = router;
