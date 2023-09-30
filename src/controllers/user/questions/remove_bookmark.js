const Question = require("../../../models/question");
const User = require("../../../models/user");

module.exports = async (req, res, next) => {
  try {
    const { questionId } = req.body;

    const questionDocument = await Question.findById(questionId);

    if (!questionDocument) {
      const error = new Error("No past question found");
      error.statusCode = 404;
      throw error;
    }

    const userId = req.userId;

    const userDoc = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { bookmarkedQuestions: questionDocument._id } },
      { new: true }
    ).populate("bookmarkedQuestions");

    const isBookmarked = userDoc.bookmarkedQuestions.some((quest) => {
      return quest._id.equals(questionDocument._id);
    });

    const result = {
      ...questionDocument.toObject(),
      userHasBookmarked: isBookmarked,
    };

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
