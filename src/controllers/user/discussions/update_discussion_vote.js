const Discussion = require("../../../models/discussion");
const User = require("../../../models/user");
const { handleVote } = require("../../../utils/utils");

module.exports = async (req, res, next) => {
  try {
    const { discussionId, voteType } = req.body;
    const userId = req.userId;

    const discussionDoc = await Discussion.findById(discussionId);

    let previousVoteType;

    let discussion;

    userHasVoted = discussionDoc.voters.some((voter) => {
      return voter.user.toString() === userId;
    });

    if (userHasVoted) {
      previousVoteType = discussionDoc.voters.find(
        (voter) => voter.user.toString() === userId
      )?.voteType;
    } else {
      if (voteType === "remove") {
        const error = new Error("Cannot remove vote");
        error.statusCode = 401;
        throw error;
      }
    }

    switch (voteType) {
      case "upvote":
        discussion = await handleVote(
          discussionId,
          "upvote",
          userId,
          userHasVoted,
          previousVoteType
        );
        break;

      case "downvote":
        discussion = await handleVote(
          discussionId,
          "downvote",
          userId,
          userHasVoted,
          previousVoteType
        );
        break;

      case "remove":
        discussion = await handleVote(
          discussionId,
          "remove",
          userId,
          userHasVoted,
          previousVoteType
        );
        break;
    }

    if (!discussion) {
      const error = new Error("Discussion does not exist");
      error.statusCode = 404;
      throw error;
    }

    await discussion.save();

    discussion = await Discussion.findById(discussionId)
      .populate({
        path: "user",
        model: User,
        select: { password: 0, bookmarkedQuestions: 0 },
      })
      .lean();

    // Extract the user's vote type from the discussion object
    let userVoteType = discussion.voters.find(
      (voter) => voter.user.toString() === userId
    )?.voteType;

    if (!userVoteType) {
      userVoteType = null;
    }

    const totalReplies = discussion.replies.length;

    delete discussion.replies;
    delete discussion.voters;

    res.status(201).json({
      ...discussion,
      userVoteType: userVoteType,
      totalReplies: totalReplies,
    });
  } catch (error) {
    next(error);
  }
};
