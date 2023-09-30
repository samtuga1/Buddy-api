const Discussion = require("../../../models/discussion");
const Question = require("../../../models/question");
const User = require("../../../models/user");

module.exports = async (req, res, next) => {
  try {
    const { text, questionId } = req.body;

    const discussion = new Discussion({
      user: req.userId,
      text: text,
    });

    const savedDiscussion = await discussion.save();

    // find the question and add the discussion to it
    await Question.findOneAndUpdate(
      { _id: questionId },
      {
        $push: {
          discussions: {
            $each: [savedDiscussion._id],
            $position: 0,
          },
        },
      }
    );

    const discussionDoc = await Discussion.findById(savedDiscussion._id)
      .populate({
        path: "user",
        model: User,
        select: { password: 0, bookmarkedQuestions: 0 },
      })
      .lean();

    const totalReplies = discussionDoc.replies.length;

    delete discussionDoc.replies;
    delete discussionDoc.voters;

    res.status(201).json({ ...discussionDoc, totalReplies: totalReplies });
  } catch (error) {
    next(error);
  }
};
