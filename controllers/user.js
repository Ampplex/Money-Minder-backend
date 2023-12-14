const User = require("../models/user");

const handleAddExpense = async (req, res) => {
  const body = req.body;
  const userId = body.userId;
  const category = body.category;
  const amount = body.amount;

  const expenseData = {
    amount: amount,
    time: new Date(),
  };

  const existingUser = await User.findById(userId);

  if (existingUser) {
    const existingCategory = existingUser.expense.find(
      (e) => e.category === category
    );

    if (!existingCategory) {
      // If the category doesn't exist, add it
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            expense: {
              category: category,
              data: [expenseData],
              totalAmount: amount,
            },
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );
      return res.status(201).json({ msg: "success" });
    } else {
      // If the category exists, update the 'data' array
      const updatedResult = await User.findOneAndUpdate(
        { _id: userId, "expense.category": category },
        {
          $push: {
            "expense.$.data": {
              $each: [expenseData],
              $sort: { time: -1 },
            },
          },
          $inc: {
            "expense.$.totalAmount": amount,
          },
        },
        { new: true }
      );

      if (updatedResult) {
        console.log("Document updated successfully:", updatedResult);
        return res.status(201).json({ msg: "success" });
      } else {
        console.error("User or category not found");
        return res
          .status(404)
          .json({ msg: "error", reason: "User or category not found" });
      }
    }
  } else {
    console.error("User not found");
    return res.status(404).json({ msg: "error", reason: "User not found" });
  }
};

const handleCategoryExpense = async (req, res) => {
  const { id, category } = req.params;

  try {
    const userWithCategory = await User.findOne({
      _id: id,
      "expense.category": category,
    });

    if (userWithCategory) {
      const existingCategory = userWithCategory.expense.find(
        (e) => e.category === category
      );

      return res
        .status(200)
        .json({
          msg: "success",
          data: existingCategory.data,
          totalAmount: existingCategory.totalAmount,
        });
    } else {
      return res
        .status(404)
        .json({ msg: "error", reason: "Category not found" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res
      .status(500)
      .json({ msg: "error", reason: "Internal Server Error" });
  }
};

const handleGetAllExpenses = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await User.findById(id);
    const expenses = existingUser.expense;
    return res.status(200).json({ msg: "User found", expenses });
  } catch (error) {
    return res.status(404).json({ msg: "User not found" });
  }
};

module.exports = {
  handleAddExpense,
  handleCategoryExpense,
  handleGetAllExpenses,
};
