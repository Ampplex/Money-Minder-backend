require("dotenv").config();
const express = require("express");
const { connectMongoDb } = require("./connection");
// const cron = require("node-cron");
const moment = require("moment");
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

// const server_Activator = async () => {
//   const url = "https://money-minder-lndt.onrender.com/api/server_activator";
//   const response = await fetch(url);
//   return response.json();
// };

// task scheduler
// cron.schedule("* * * * *", async () => {
//   console.log(
//     "running the task every minute",
//     moment().format("DD MMM YYYY hh:mm:ss")
//   );
//   const response = await server_Activator();
//   console.log(response);
// });

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
