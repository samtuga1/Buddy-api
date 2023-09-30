const Discussion = require("../../../models/discussion");
const DiscussionReply = require("../../../models/discussion_reply");
const User = require("../../../models/user");

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { page } = req.query;

    const perPage = 3;

    const discussionDoc = await Discussion.findById(id)
      .populate({
        path: "replies",
        model: DiscussionReply,
        populate: {
          path: "user",
          model: User,
          select: { password: 0, bookmarkedQuestions: 0 },
        },
        options: {
          skip: (page - 1) * perPage,
          limit: perPage,
        },
      })
      .select("replies")
      .lean();

    if (!discussionDoc) {
      const error = new Error("Discussion does not exist");
      error.statusCode = 404;
      throw error;
    }

    const discussionReplies = discussionDoc.replies;

    res.status(200).json(discussionReplies);
  } catch (error) {
    next(error);
  }
};
