const express = require("express");
const { handleAddExpense } = require("../controllers/user");
const { handleCategoryExpense } = require("../controllers/user");
const { handleGetAllExpenses } = require("../controllers/user");

const router = express.Router();

router.route("/addExpense").post(handleAddExpense);
router.get("/getExpense/:id/:category", handleCategoryExpense);
router.get("/getAllExpenses/:id/", handleGetAllExpenses);

module.exports = router;
