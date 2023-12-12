const User = require("../models/user");

const handleAddExpense = async (req, res) => {
  const body = req.body;
  const userId = req.userId;
  console.log(body);

  const expenseData = {
    amount: body.expense.amount,
    category: body.expense.category,
    time: new Date(),
  };

  User.updateOne(
    { _id: userId },
    { $set: { expense: expenseData } },
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Document updated successfully:", result);
      }
    }
  );
};

module.exports = {
  handleAddExpense,
};
