const Discussion = require("../models/discussion");

require("dotenv").config({ path: ".env" });

exports.randomCharacters = (length) => {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomCharacters = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCharacters += characters.charAt(randomIndex);
  }

  return randomCharacters;
};

exports.capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.handleVote = async (
  discussionId,
  voteType,
  userId,
  userHasVoted,
  previousVoteType
) => {
  if (voteType === "remove") {
    return await Discussion.findOneAndUpdate(
      { _id: discussionId },
      {
        $inc: { votes: previousVoteType === "downvote" ? 1 : -1 },
        $pull: { voters: { user: userId } },
      },
      { new: true }
    );
  } else {
    if (userHasVoted) {
      if (previousVoteType === "upvote") {
        if (voteType === "upvote") {
          return await Discussion.findOneAndUpdate(
            { _id: discussionId },
            { $inc: { votes: -1 }, $pull: { voters: { user: userId } } },
            { new: true }
          );
        } else {
          return await Discussion.findOneAndUpdate(
            { _id: discussionId, "voters.user": userId },
            { $set: { "voters.$.voteType": voteType }, $inc: { votes: -2 } },
            { new: true }
          );
        }
      } else {
        if (voteType === "downvote") {
          return await Discussion.findOneAndUpdate(
            { _id: discussionId },
            { $inc: { votes: 1 }, $pull: { voters: { user: userId } } },
            { new: true }
          );
        } else {
          return await Discussion.findOneAndUpdate(
            { _id: discussionId, "voters.user": userId },
            { $set: { "voters.$.voteType": voteType }, $inc: { votes: 2 } },
            { new: true }
          );
        }
      }
    } else {
      return await Discussion.findOneAndUpdate(
        { _id: discussionId },
        {
          $inc: { votes: voteType === "downvote" ? -1 : 1 },
          $addToSet: { voters: { user: userId, voteType: voteType } },
        },
        { new: true }
      );
    }
  }
};
