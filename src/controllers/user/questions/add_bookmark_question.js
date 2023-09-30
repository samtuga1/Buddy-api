const Question = require("../../../models/question");
const User = require("../../../models/user");

module.exports = async (req, res, next) => {
  try {
    const { questionId } = req.body;

    const questionDocument = await Question.findById(questionId).select(
      "-discussions"
    );

    if (!questionDocument) {
      const error = new Error("No past question found");
      error.statusCode = 404;
      throw error;
    }

    let isBookmarked = false;

    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user.bookmarkedQuestions.includes(questionDocument._id)) {
      const updatedBookmarkedQuestions = [
        questionDocument._id,
        ...user.bookmarkedQuestions,
      ];

      const userDoc = await User.findOneAndUpdate(
        { _id: userId },
        { bookmarkedQuestions: updatedBookmarkedQuestions },
        { new: true }
      ).populate("bookmarkedQuestions");

      isBookmarked = userDoc.bookmarkedQuestions.some((quest) =>
        quest._id.equals(questionDocument._id)
      );
    }

    const result = {
      ...questionDocument.toObject(),
      userHasBookmarked: isBookmarked,
    };

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
