const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: ".env.staging" });
const { initializeApp } = require("firebase/app");
const mongoose = require("mongoose");

const authRoutes = require("./src/routes/auth.js");
const firebaseConfig = require("./src/config/firebase_config.js");

const app = express();

app.use(bodyParser.json());

app.use("/staging/account/user", authRoutes);

app.use((error, req, res, next) => {
  // set the status code here
  const statusCode = error.statusCode || 500;

  // set the error message here
  const title = error.message;

  // set the reason for the error
  const data = Array.isArray(error.data) ? error.data[0].msg : error.data;

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
