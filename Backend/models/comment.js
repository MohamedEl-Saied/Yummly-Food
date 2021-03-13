const mongoose = require("mongoose");

// title,content , imageURL
const CommentSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// add posts and commnets

module.exports = mongoose.model("Comment", CommentSchema);
