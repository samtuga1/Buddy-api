const Question = require("../../../models/question");

module.exports = async (req, res, next) => {
  try {
    // retrieve the level pressed
    const { school, page } = req.query;

    // question fetched per page
    const perPage = 10;

    const questionsArray = await Question.find({
      school: { $regex: new RegExp(school, "i") }, // 'i' flag for case-insensitive matching
    })
      .select("-userHasBookmarked -discussions")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalCount = await Question.find({
      school: { $regex: new RegExp(school, "i") },
    })
      .select("-discussions")
      .countDocuments();

    res.status(200).json({
      result: questionsArray,
      totalCount: totalCount,
    });
  } catch (error) {
    next(error);
  }
};
