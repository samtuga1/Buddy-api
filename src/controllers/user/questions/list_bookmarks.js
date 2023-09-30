const Question = require("../../../models/question");
const User = require("../../../models/user");

module.exports = async (req, res, next) => {
  try {
    const userId = req.userId;

    const page = req.query.page;

    const perPage = 10;

    const updatedUserDoc = await User.findById(userId)
      .populate({
        path: "bookmarkedQuestions",
        model: Question,
        select: { discussions: 0 },
        options: {
          skip: (page - 1) * perPage || 0,
          limit: perPage,
        },
      })
      .select("bookmarkedQuestions");

    const totalCount = await User.findById(userId)
      .populate({
        path: "bookmarkedQuestions",
        model: Question,
      })
      .select("bookmarkedQuestions")
      .countDocuments();

    res.status(201).json({
      result: updatedUserDoc.bookmarkedQuestions,
      totalCount: totalCount,
    });
  } catch (error) {
    next(error);
  }
};
