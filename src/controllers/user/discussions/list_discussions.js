const Question = require("../../../models/question");
const Discussion = require("../../../models/discussion");
const User = require("../../../models/user");

module.exports = async (req, res, next) => {
  try {
    const userId = req.userId;

    const { questionId } = req.body;

    const { page } = req.query;

    const perPage = 10;

    // find the question and add the discussion to it
    const question = await Question.findById(questionId)
      .populate({
        path: "discussions",
        model: Discussion,
        populate: {
          path: "user",
          model: User,
          select: { password: 0, bookmarkedQuestions: 0 },
        },
        options: {
          skip: (page - 1) * perPage || 0,
          limit: perPage,
        },
      })
      .select("discussions")
      .lean();

    // // Get the total discussions associated with the question
    const totalDiscussions = await Question.findById(questionId)
      .select("discussions")
      .lean();

    const totalCount = totalDiscussions.discussions.length;

    // Calculate the total counts of replies for each discussion
    const discussionsWithReplyCounts = question.discussions.map(
      (discussion) => {
        const totalReplies = discussion.replies.length;

        // extract the discussions into a new object
        // let result = { discussion };

        userVoteType = discussion.voters.find(
          (voter) => voter.user.toString() === userId
        )?.voteType;

        if (!userVoteType) {
          userVoteType = null;
        }

        // dont send replies to the frontend
        delete discussion.replies;

        // dont send likedUsers to the frontend
        delete discussion.voters;

        return {
          ...discussion,
          userVoteType: userVoteType,
          totalReplies: totalReplies,
        };
      }
    );

    res.status(200).json({
      result: discussionsWithReplyCounts,
      totalCount: totalCount,
    });
  } catch (error) {
    next(error);
  }
};
