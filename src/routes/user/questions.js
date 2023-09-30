const express = require("express");

const listQuestionsController = require("../../controllers/user/questions/list_questions");
const retrieveQuestionController = require("../../controllers/user/questions/retrieve_question");
const addBookmarkQuestionController = require("../../controllers/user/questions/add_bookmark_question");
const removeBookmarkQuestionController = require("../../controllers/user/questions/remove_bookmark");
const listBookmarkedQuestionsController = require("../../controllers/user/questions/list_bookmarks");
const isAuth = require("../../middlewares/is_auth");

const router = express.Router();

router.get("/list", isAuth, listQuestionsController);

router.get("/retrieve/:id", isAuth, retrieveQuestionController);

router.post("/bookmark/add", isAuth, addBookmarkQuestionController);

router.delete("/bookmark/remove", isAuth, removeBookmarkQuestionController);

router.get("/bookmark/list", isAuth, listBookmarkedQuestionsController);

module.exports = router;
