const User = require("../models/user");

const handleAddExpense = async (req, res) => {
  const body = req.body;
  const userId = body.userId;

  const expenseData = {
    amount: body.amount,
    category: body.category,
    time: new Date(),
  };

  try {
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { expense: expenseData } },
      { new: true }
    );

    if (result) {
      console.log("Document updated successfully:", result);
      return res.status(201).json({ msg: "success" });
    } else {
      console.error("User not found");
      return res.status(404).json({ msg: "error", reason: "User not found" });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    return res
      .status(500)
      .json({ msg: "error", reason: "Internal Server Error" });
  }
};

module.exports = {
  handleAddExpense,
};
