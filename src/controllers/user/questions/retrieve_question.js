const Question = require("../../../models/question");
const User = require("../../../models/user");

module.exports = async (req, res, next) => {
  try {
    // get the question id from the params
    const questionId = req.params.id;

    const question = await Question.findById(questionId).select("-discussions");

    if (!question) {
      const error = new Error("No question found");
      error.statusCode = 404;
      throw error;
    }

    const userDoc = await User.findById(req.userId);

    const isBookmarked = userDoc.bookmarkedQuestions.some((quest) => {
      return quest._id.equals(question._id);
    });

    const result = { ...question.toObject(), userHasBookmarked: isBookmarked };

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
