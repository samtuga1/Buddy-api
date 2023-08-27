const { Schema, model } = require("mongoose");

const token_schema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "user",
    },
    token: {
      type: String,
      require: true,
    },
    expireAt: { type: Date, expires: 600 },
  },
  { versionKey: false }
);

module.exports = model("token", token_schema);
