const User = require("../models/user");

const handleEditName = async (req, res) => {
  const body = req.body;
  const userName = body.name;
  const userId = body.id;

  try {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          name: userName,
        },
      }
    );

    return res.status(200).json({ msg: "success" });
  } catch (err) {
    return res.status(500).json({ msg: "Internal sever error" });
  }
};

const handleEditBio = async (req, res) => {
  const body = req.body;
  const Bio = body.bio;
  const userId = body.id;

  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { bio: Bio } },
      { new: true }
    );

    return res.status(200).json({ msg: "success" });
  } catch (err) {
    return res.status(500).json({ msg: "Internal sever error" });
  }
};

const handleEditIncome = async (req, res) => {
  const body = req.body;
  const Income = body.income;
  const userId = body.id;

  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { income: Income } },
      { new: true }
    );

    return res.status(200).json({ msg: "success" });
  } catch (err) {
    return res.status(200).json({ msg: "Income must be an Integer" });
  }
};

const handleEditBudget = async (req, res) => {
  const body = req.body;
  const Budget = body.budget;
  const userId = body.id;

  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { budget: Budget } },
      { new: true }
    );

    return res.status(200).json({ msg: "success" });
  } catch (err) {
    return res.status(200).json({ msg: "Budget must be an Integer" });
  }
};

module.exports = {
  handleEditName,
  handleEditBio,
  handleEditIncome,
  handleEditBudget,
};
