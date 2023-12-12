const express = require("express");
const { handleAddExpense } = require("../controllers/user");

const router = express.Router();

router.route("/addExpense").post(handleAddExpense);

module.exports = router;
