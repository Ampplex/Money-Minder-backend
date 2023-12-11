const express = require("express");
const {
  handleUserLogin,
  handleUserSignUp,
} = require("../controllers/authentication");

const router = express.Router();

router.route("/login").post(handleUserLogin);
router.route("/signup").post(handleUserSignUp);

module.exports = router;
