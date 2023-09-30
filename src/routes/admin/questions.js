const express = require("express");
const multer = require("multer");

const router = express.Router();

const listQuestionsController = require("../../controllers/admin/questions/list_questions");
const addQuestionController = require("../../controllers/admin/questions/add_question");

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get("/list", listQuestionsController);

router.put(
  "/add",
  upload.single("file", { name: "file" }),
  addQuestionController
);

module.exports = router;
