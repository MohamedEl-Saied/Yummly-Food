const Comment = require("../models/comment");
const User = require("../models/user");
const Post = require("../models/post");
const Admin = require("../models/admin");
const { createCommentValidation } = require("../validation");
exports.createComment = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = createCommentValidation(req.body).error;
  if (!postId) {
    const error = new Error();
    error.statusCode = 404;
    err.message = "Error .. Please Enter Post ID";
    return next(error);
  }
  if (errors) {
    const error = new Error(errors.details[0].message);
    error.statusCode = 422;
    return next(error);
  }
  try {
    const comment = new Comment(req.body);
    comment.author = req.userID;
    let user = await User.findById(req.userID);
    let post = await Post.findById(postId);
    user.comments.push(comment);
    post.comments.push(comment);
    const newComment = await comment.save();

    await user.save();
    await post.save();
    const crateadComment = await Comment.findById(newComment._id).populate(
      "author"
    );
    res.status(201).json({
      Data: crateadComment,
      Message: `Comment Created Successfully By ${user.username} To Post`,
      Error: null,
      Success: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

exports.editComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  if (!commentId) {
    const error = new Error();
    error.statusCode = 404;
    error.message = "Error .. Please Enter Comment ID";
    return next(error);
  }
  try {
    const errors = createCommentValidation(req.body).error;
    if (errors) {
      const error = new Error(errors.details[0].message);
      error.statusCode = 422;
      throw error;
    }
    const foundComment = await Comment.findById(commentId);
    if (!foundComment) {
      const error = new Error();
      error.statusCode = 404;
      error.message = "Couldn't Find Comment With This ID";
      throw error;
    }
    const admin = await Admin.findById("6027109bb911cc1e1c5d0540");
    if (foundComment.author.toString() != req.userID.toString() && !admin) {
      const error = new Error();
      error.statusCode = 403;
      error.message = "Error , You Can't Edit This Comment";
      throw error;
    }
    const comment = await Comment.findByIdAndUpdate(commentId, req.body, {
      new: true,
    }).populate("author");
    return res.status(200).json({
      Message: "Comment Is Updated",
      Data: comment,
      Success: true,
      Error: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const foundComment = await Comment.findById(req.params.commentId);
    if (!foundComment) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Comment With This ID , Please Try With Another ID";
      throw error;
    }
    const admin = await Admin.findById("6027109bb911cc1e1c5d0540");

    if (foundComment.author.toString() != req.userID.toString() && !admin) {
      const error = new Error();
      error.statusCode = 403;
      error.message = "Error , You Can't Delete This Comment";
      throw error;
    }
    const comment = await Comment.findByIdAndDelete(
      req.params.commentId,
      req.body
    );
    await User.findByIdAndUpdate(req.userID, {
      $pull: { comments: req.params.commentId },
    });
    await Post.findByIdAndUpdate(req.params.postId, {
      $pull: { comments: req.params.commentId },
    });
    return res.status(200).json({
      Message: "Comment Is Deleted",
      Data: comment,
      Success: true,
      Error: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

// for admin dashboard

exports.getComments = async (req, res, next) => {
  try {
    const allComments = await Comment.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "author", model: "User" });

    if (!allComments) {
      const error = new Error();
      error.statusCode = 401;
      error.message = "No Comments Are Founded";
      throw error;
    }
    res.status(200).json({
      Data: allComments,
      Message: "Comments Are Found Successfully",
      Success: true,
      Error: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getComment = async (req, res, next) => {
  try {
    // body => {id: 'fdlsglp[sd']}

    const foundComment = await Comment.findById(req.params.commentID).populate({
      path: "author",
      model: "User",
    });

    if (!foundComment) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Comment With This ID , Please Try With Another ID";
      return next(error);
    }

    return res.status(200).json({
      Message: "Comment Is Found",
      Data: foundComment,
      Success: true,
      Error: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};
