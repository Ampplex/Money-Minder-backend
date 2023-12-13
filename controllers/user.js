const User = require("../models/user");

const handleAddExpense = async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  console.log(body);

  const expenseData = {
    amount: body.amount,
    category: body.category,
    time: new Date(),
  };

  User.updateOne({ _id: userId }, { $set: { expense: expenseData } })
    .then((result) => {
      console.log("Document updated successfully:", result);
    })
    .catch((error) => {
      console.error("Error updating document:", error);
    });

  return res.status(201).json({ msg: "success" });
};

module.exports = {
  handleAddExpense,
};
