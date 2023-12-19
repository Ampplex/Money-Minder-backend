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
  const { timeRange } = req.query;

  try {
    const userWithCategory = await User.findOne({
      _id: id,
      "expense.category": category,
    });

    if (userWithCategory) {
      const existingCategory = userWithCategory.expense.find(
        (e) => e.category === category
      );

      let filteredData;

      switch (timeRange) {
        case "weekly":
          // Filter data for the weekly time range (from the oldest week to the current week of the current month)
          const currentMonthData = existingCategory.data.filter(
            (item) =>
              new Date(item.time).getFullYear() === new Date().getFullYear() &&
              new Date(item.time).getMonth() === new Date().getMonth()
          );

          filteredData = groupDataByWeek(currentMonthData);
          break;

        case "monthly":
          // Group data by month and year, then calculate total amount for each month
          const currentYearMonthlyData = existingCategory.data.filter(
            (item) =>
              new Date(item.time).getFullYear() === new Date().getFullYear()
          );

          filteredData = groupDataByMonth(currentYearMonthlyData);
          break;
        case "yearly":
          // Filter data for each year from oldest to latest
          const oldestYear = existingCategory.data.reduce((minYear, item) => {
            const year = new Date(item.time).getFullYear();
            return year < minYear ? year : minYear;
          }, new Date().getFullYear());

          filteredData = existingCategory.data.filter(
            (item) => new Date(item.time).getFullYear() >= oldestYear
          );
          break;
        default:
          // Default case, no filtering
          filteredData = existingCategory.data;
      }

      // Calculate total amount for each time range
      const timeRangeData = calculateTotalAmount(filteredData, timeRange);

      return res.status(200).json({
        msg: "success",
        data: timeRangeData,
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

const handleCategoryExpenseForAI = async (req, res) => {
  const { id, category } = req.params;

  try {
    const userWithCategory = await User.findOne({
      _id: id,
      "expense.category": category,
    });

    console.log(userWithCategory);

    if (userWithCategory) {
      const existingCategory = userWithCategory.expense.find(
        (e) => e.category === category
      );
      return res.status(200).json({ data: existingCategory.data, category });
    } else {
      return res.status(404).json({ msg: "error" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res
      .status(500)
      .json({ msg: "error", reason: "Internal Server Error" });
  }
};

const groupDataByWeek = (data) => {
  const result = {};

  data.forEach((item) => {
    const date = new Date(item.time);
    const weekNumber = date.getWeek();

    // Check if the result object already contains an entry for the current week
    const weekKey = `week${weekNumber}`;
    if (result[weekKey]) {
      // If an entry exists, update the amount
      result[weekKey] += item.amount;
    } else {
      // If no entry exists, create a new one
      result[weekKey] = item.amount;
    }
  });

  return result;
};

const groupDataByMonth = (data) => {
  const result = {};

  data.forEach((item) => {
    const date = new Date(item.time);
    const yearMonth = `${String(date.getMonth() + 1).padStart(2, "0")}`;

    // Check if the result object already contains an entry for the current month
    if (result[yearMonth]) {
      // If an entry exists, update the amount
      result[yearMonth] += item.amount;
    } else {
      // If no entry exists, create a new one
      result[yearMonth] = item.amount;
    }
  });

  console.log("Grouped Data by Month:", result); // Add this log statement

  return result;
};

const calculateTotalAmount = (data, timeRange) => {
  const result = {};

  if (typeof data === "object" && !Array.isArray(data)) {
    Object.keys(data).forEach((formattedTime) => {
      result[formattedTime] = data[formattedTime];
    });
  } else if (Array.isArray(data)) {
    data.forEach((item) => {
      const date = new Date(item.time);

      // Adjust the condition based on the timeRange
      let formattedTime;
      switch (timeRange) {
        case "weekly":
          formattedTime = formatDate(date, "week");
          break;
        case "monthly":
          formattedTime = formatDate(date, "month");
          break;
        case "yearly":
          formattedTime = date.getFullYear().toString();
          break;
        default:
          formattedTime = formatDate(date, "default");
      }

      result[formattedTime] = (result[formattedTime] || 0) + item.amount;
    });
  }

  console.log("Total Amount Data:", result); // Add this log statement

  return result;
};

const formatDate = (date, format) => {
  switch (format) {
    case "week":
      return `${date.getFullYear()}-W${String(date.getWeek()).padStart(
        2,
        "0"
      )}`;
    case "month":
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    case "default":
      return date.toISOString();
    default:
      return date.toISOString();
  }
};

// Add a getWeek method to the Date object
Date.prototype.getWeek = function () {
  const d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const handleGetAllExpenses = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await User.findById(id);
    const expenses = existingUser.expense;
    return res.status(200).json({ msg: "success", expenses });
  } catch (error) {
    return res.status(404).json({ msg: "User not found" });
  }
};

const handleGetBio = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);

    return res.status(200).json({ Bio: existingUser.bio });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal sever error" });
  }
};

const handleGetIncome = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);

    return res.status(200).json({ Income: existingUser.income });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal sever error" });
  }
};

const handleGetBudget = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);
    if (existingUser.budget == "") {
      existingUser.budget = 0;
    }
    return res.status(200).json({ Budget: existingUser.budget });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal sever error" });
  }
};

const handleGetName = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);

    return res.status(200).json({ Name: existingUser.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal sever error" });
  }
};

module.exports = {
  handleAddExpense,
  handleCategoryExpense,
  handleGetAllExpenses,
  handleCategoryExpenseForAI,
  handleGetBio,
  handleGetIncome,
  handleGetBudget,
  handleGetName,
};
