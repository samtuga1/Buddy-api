const express = require("express");

const router = express.Router();

const listDiscussionsController = require("../../controllers/user/discussions/list_discussions");
const voteController = require("../../controllers/user/discussions/update_discussion_vote");
const replyController = require("../../controllers/user/discussions/reply_discussion");
const addDiscussionController = require("../../controllers/user/discussions/add_discussion");
const listDiscussionRepliesController = require("../../controllers/user/discussions/list_replies");

const isAuth = require("../../middlewares/is_auth");

router.get("/list", isAuth, listDiscussionsController);

router.post("/vote", isAuth, voteController);

router.put("/add", isAuth, addDiscussionController);

router.post("/:discussionId/reply", isAuth, replyController);

router.get("/:id/list/replies", isAuth, listDiscussionRepliesController);

module.exports = router;
