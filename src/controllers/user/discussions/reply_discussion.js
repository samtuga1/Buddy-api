const Discussion = require("../../../models/discussion");
const DiscussionReply = require("../../../models/discussion_reply");
const User = require("../../../models/user");

module.exports = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    const discussionReplyModel = await DiscussionReply({
      user: userId,
      text: text,
    });

    const discussionReplyDoc = await discussionReplyModel.save();

    const discussionDoc = await Discussion.findOneAndUpdate(
      { _id: discussionId },
      { $push: { replies: discussionReplyDoc._id } },
      { new: true }
    );

    if (!discussionDoc) {
      const error = new Error("Discussion does not exist");
      error.statusCode = 404;
      throw error;
    }

    const reply = await DiscussionReply.findById(discussionReplyModel._id)
      .populate({
        path: "user",
        model: User,
        select: { password: 0, bookmarkedQuestions: 0 },
      })
      .lean();

    res.status(200).json(reply);
  } catch (error) {
    next(error);
  }
};
