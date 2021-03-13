const Post = require("../models/post");
const User = require("../models/user");
const Admin = require("../models/admin");

const { createPostValidation } = require("../validation");

exports.getPosts = async (req, res, next) => {
  try {
    const allPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "author", model: "User" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          model: "User",
        },
      });
    //console.log(allPosts[0]);
    if (!allPosts) {
      const error = new Error();
      error.statusCode = 401;
      error.message = "Not Posts Are Founded";
      throw error;
    }
    res.status(200).json({
      Data: allPosts,
      Message: "Posts Are Found Successfully",
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

exports.createPost = async (req, res, next) => {
  const { title, content, imageURL } = req.body;
  console.log(req.body);
  const errors = createPostValidation({ title, content }).error;
  if (errors) {
    const error = new Error(errors.details[0].message);
    error.statusCode = 422;

    return next(error);
  }

  try {
    // if (!req.file) {
    //   const error = new Error("No Image Provided");
    //   error.statusCode = 422;

    //   throw error;
    // }
    let image;
    if (req.file) {
      image = req.file.path;
    }
    if (imageURL && !req.file) {
      if (imageURL.includes("https")) {
        console.log("Contains HTTPS");
        image = imageURL;
      }
    }
    console.log("image", image);

    // console.log(imageURL);
    // console.log(req.file.filename, "file");
    const post = new Post({
      title: title,
      content: content,
      imageURL: image,
    });
    post.author = req.userID;
    let user = await User.findById(req.userID);
    user.posts.push(post);

    await post.save();
    const newPost = await Post.findById(post._id)
      .populate({ path: "author", model: "User" })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "User",
        },
      });
    await user.save();
    res.status(201).json({
      Data: newPost,
      Message: `Post Created Successfully By ${user.username}`,
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
exports.showPost = async (req, res, next) => {
  try {
    // body => {id: 'fdlsglp[sd']}

    const foundPost = await Post.findById(req.params.postId)
      .populate({ path: "author", model: "User" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          model: "User",
        },
      });
    if (!foundPost) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Post With This ID , Please Try With Another ID";
      return next(error);
    }

    return res.status(200).json({
      Message: "Post Is Found",
      Data: foundPost,
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

exports.editPost = async (req, res, next) => {
  const { title, content } = req.body;
  console.log(req.body);
  try {
    const errors = createPostValidation({ title, content }).error;
    if (errors) {
      const error = new Error(errors.details[0].message);
      error.statusCode = 422;
      return next(error);
    }
    const foundPost = await Post.findById(req.params.postId);
    const admin = await Admin.findById("6027109bb911cc1e1c5d0540");
    let image;
    if (req.file) {
      image = req.file.path;
    } else if (foundPost.imageURL != "") {
      image = foundPost.imageURL;
    } else {
      image = "";
    }
    if (foundPost.author.toString() != req.userID.toString() && !admin) {
      const error = new Error();
      error.statusCode = 403;
      error.message = "Error , You Can't Edit This Post";
      next(error);
    }
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        title: title,
        content: content,
        imageURL: image,
      },
      {
        new: true,
      }
    )
      .populate({ path: "author", model: "User" })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "User",
        },
      });
    return res.status(200).json({
      Message: "Post Is Updated",
      Data: post,
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
exports.deletePost = async (req, res, next) => {
  try {
    const foundPost = await Post.findById(req.params.postId);
    if (!foundPost) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Post With This ID , Please Try With Another ID";
      return next(error);
    }
    const admin = await Admin.findById("6027109bb911cc1e1c5d0540");

    if (foundPost.author.toString() != req.userID.toString() && !admin) {
      const error = new Error();
      error.statusCode = 403;
      error.message = "Error , You Can't Delete This Post";
      return next(error);
    }
    const post = await Post.findByIdAndDelete(req.params.postId, req.body);
    await User.findByIdAndUpdate(req.userID, {
      $pull: { posts: req.params.postId },
    });
    return res.status(200).json({
      Message: "Post Is Deleted",
      Data: post,
      Success: true,
      Error: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    err.message = "Somthing Went Wrong !";
    return next(err);
  }
};
exports.addToFavorite = async (req, res, next) => {
  try {
    const foundPost = await Post.findById(req.params.postId);
    if (!foundPost) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Post With This ID , Please Try With Another ID";
      return next(error);
    }
    const user = await User.findById(req.userID);
    // user.favoritePosts.push(foundPost);
    let userPosts = await User.findByIdAndUpdate(
      req.userID,
      {
        $push: { favoritePosts: req.params.postId },
      },
      { new: true }
    );
    await userPosts.save();
    let currentUser = await user.save();
    return res.status(200).json({
      Message: "Added post to favorites",
      Data: userPosts.favoritePosts,
      Success: true,
      Error: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    err.message = "Somthing Went Wrong !";
    return next(err);
  }
};
exports.removeFromFavorite = async (req, res, next) => {
  try {
    const foundPost = await Post.findById(req.params.postId);
    console.log(req.params);
    if (!foundPost) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Post With This ID , Please Try With Another ID";
      return next(error);
    }
    const user = await User.findById(req.userID);
    let userPosts = await User.findByIdAndUpdate(
      req.userID,
      {
        $pull: { favoritePosts: req.params.postId },
      },
      { new: true }
    );
    return res.status(200).json({
      Message: "Removed post from favorites",
      Data: userPosts.favoritePosts,
      Success: true,
      Error: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    err.message = "Somthing Went Wrong !";
    return next(err);
  }
};
// Add or remove like
exports.addOrRemoveLike = async (req, res, next) => {
  const { like } = req.body;
  console.log(req.body);
  try {
    if (!req.body) {
      const error = new Error("Somthing went wrong ! no data provided!!");
      error.statusCode = 422;
      throw error;
    }
    const foundPost = await Post.findById(req.params.postId).populate({
      path: "likes",
      populate: {
        path: "users",
        model: "User",
      },
    });
    const foundUser = await User.findById(req.userID);
    // const admin = await Admin.findById("6027109bb911cc1e1c5d0540");
    if (!foundPost || !foundUser) {
      const error = new Error("Can't find user or post , please try again!");
      error.statusCode = 404;
      throw error;
    }
    // if (foundPost.likes.author.toString() != req.userID.toString() && !admin) {
    //   const error = new Error();
    //   error.statusCode = 403;
    //   error.message = "Error , You Can't Edit This Like";
    //   next(error);
    // }
    // let data = {
    //   author: req.userID,
    //   like: like,
    // };

    // const post = await Post.findByIdAndUpdate(req.params.postId, {
    //   $push: { likes: data },
    // });
    let user;
    let message;
    // await foundPost.save();
    if (like == false) {
      message = "Like removed successfully";
      user = await User.findByIdAndUpdate(
        req.userID,
        {
          $pull: { likedPosts: req.params.postId },
        },
        { new: true }
      );
      await user.save();
      foundPost.likes.users = foundPost.likes.users.filter((user) => {
        return user != req.userID;
      });
      if (foundPost.likes.like == 0) {
        foundPost.likes.like = 0;
      } else {
        foundPost.likes.like -= 1;
      }
      await foundPost.save();
    } else {
      foundPost.likes.users.push(req.userID);
      foundPost.likes.like += 1;
      message = "Like added successfully";
      // user = new User();
      user = await User.findByIdAndUpdate(
        req.userID,
        {
          $push: { likedPosts: req.params.postId },
        },
        { new: true }
      );
    }

    await foundPost.save();
    console.log("post with like , :", foundPost);
    console.log("user with like , :", user);
    // const postAfterUpdate = await Post.findById(req.params.postId);

    return res.status(200).json({
      Message: message,
      Data: { foundPost, user },
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
