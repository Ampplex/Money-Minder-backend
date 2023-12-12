const { authenticateToken } = require("../middlewares/authentication");
const User = require("../models/user");
const express = require("express");
const app = express();

// Middleware to authenticate the token
app.use(authenticateToken);

const handleUserLogin = async (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.email || !body.password) {
    console.log(body);
    return res.status(400).json({ error: "All fields are required" });
  } else {
    const { email, password } = req.body;

    try {
      const token = await User.matchPasswordAndGenerateToken(email, password);
      return res.status(200).json({ token, msg: "success" });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ error: "Invalid credentials" });
    }
  }
};

const handleUserSignUp = async (req, res) => {
  const body = req.body;

  if (!body.name || !body.email || !body.password) {
    return res.status(404).json({ msg: "All fields are required" });
  }

  const result = await User.create({
    name: body.name,
    email: body.email,
    password: body.password,
  });

  // console.log(result);

  return res
    .status(201)
    .json({ msg: "User created successfully", id: result._id });
};

module.exports = {
  handleUserLogin,
  handleUserSignUp,
};
