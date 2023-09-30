const { model, Schema } = require("mongoose");

const discussion_schema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "user",
    },
    text: {
      type: String,
      require: true,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "discussion_reply",
        default: [],
      },
    ],
    votes: { type: Number, default: 0 }, // Number of votes
    voters: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        voteType: {
          type: String,
          enum: ["upvote", "downvote", null], // Possible vote types
          default: null,
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("discussion", discussion_schema);
