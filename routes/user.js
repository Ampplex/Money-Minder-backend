const express = require("express");
const { handleAddExpense } = require("../controllers/user");
const { handleCategoryExpense } = require("../controllers/user");
const { handleGetAllExpenses } = require("../controllers/user");
const { handleCategoryExpenseForAI } = require("../controllers/user");
const {
  handleGetBio,
  handleGetIncome,
  handleGetBudget,
  handleGetName,
} = require("../controllers/user");

const {
  handleEditName,
  handleEditBio,
  handleEditIncome,
  handleEditBudget,
} = require("../controllers/editUser");

const router = express.Router();

router.route("/addExpense").post(handleAddExpense);
router.route("/editName").patch(handleEditName);
router.route("/editIncome").patch(handleEditIncome);
router.route("/editBio").patch(handleEditBio);
router.route("/editBudget").patch(handleEditBudget);
router.get("/getExpense/:id/:category", handleCategoryExpense);
router.get("/getExpenseAI/:id/:category", handleCategoryExpenseForAI);
router.get("/getAllExpenses/:id/", handleGetAllExpenses);
router.get("/getBio/:id/", handleGetBio);
router.get("/getIncome/:id/", handleGetIncome);
router.get("/getBudget/:id/", handleGetBudget);
router.get("/getName/:id/", handleGetName);

module.exports = router;
