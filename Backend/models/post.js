const mongoose = require("mongoose");

// title,content , imageURL
const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    imageURL: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: {
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      like: {
        type: Number,
        default: 0,
      },
    },
  },

  {
    timestamps: true,
  }
);

// add posts and commnets

module.exports = mongoose.model("Post", PostSchema);
