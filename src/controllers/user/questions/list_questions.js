const Question = require("../../../models/question");

module.exports = async (req, res, next) => {
  try {
    // retrieve the programme the user offers from the request
    const programme = req.programme;
    const school = req.school;

    console.log(programme);
    console.log(school);

    // retrieve the level pressed
    const { level, page } = req.query;

    // question fetched per page
    const perPage = 10;

    const questionsArray = await Question.find({
      school: { $regex: new RegExp(school, "i") },
      programme: { $regex: new RegExp(programme, "i") }, // 'i' flag for case-insensitive matching
      level: level,
    })
      .select("-userHasBookmarked -discussions")
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalCount = await Question.find({
      school: { $regex: new RegExp(school, "i") },
      programme: { $regex: new RegExp(programme, "i") }, // 'i' flag for case-insensitive matching
      level: level,
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
