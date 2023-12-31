const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: ".env" });
const { initializeApp } = require("firebase/app");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./src/routes/user/auth.js");
const questionsRoutes = require("./src/routes/user/questions.js");
const adminQuestionsRoutes = require("./src/routes/admin/questions.js");
const discussionsRoutes = require("./src/routes/user/discussions.js");
const firebaseConfig = require("./src/config/firebase_config.js");

const app = express();

// Enable CORS for all routes (allow all origins)
app.use(cors());

app.use(bodyParser.json());

app.use("/account/user", authRoutes);
app.use("/questions", questionsRoutes);
app.use("/discussions", discussionsRoutes);

app.use("/admin/questions", adminQuestionsRoutes);

app.use((error, req, res, next) => {
  // set the status code here
  const statusCode = error.statusCode || 500;

  // set the error message here
  const title = error.message;

  // set the reason for the error
  const data = Array.isArray(error.data) ? error.data[0].msg : error.data;

  console.log(error);

  // send the json object to the frontend
  res.status(statusCode).json({
    message: data || title,
  });
});

// for handling invalid requests
app.use("/", (req, res, next) => {
  return res.status(404).json({
    message: "Invalid enpoint reached",
  });
});

mongoose
  .connect(process.env.DB_CONNECTION_URL)
  .then(() => {
    //Initialize a firebase application
    initializeApp(firebaseConfig);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
