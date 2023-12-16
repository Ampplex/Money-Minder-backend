require("dotenv").config();
const express = require("express");
const { connectMongoDb } = require("./connection");
const app = express();

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const serverRouter = require("./routes/server");

const PORT = process.env.PORT || 8080;

// Connection
connectMongoDb(process.env.MONGO_URL).then(() => {
  console.log("MongoDB connected!");
});

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/server_activator", serverRouter);

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
