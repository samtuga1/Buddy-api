const { model, Schema } = require("mongoose");

const discussion_reply_schema = Schema(
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
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("discussion_reply", discussion_reply_schema);
