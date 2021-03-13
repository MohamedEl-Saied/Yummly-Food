const User = require("../models/user");
exports.addRecipeToFavorite = async (req, res, next) => {
  console.log(req.params);
  try {
    const recipe = req.params.recipeID;
    if (!recipe) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Recipe With This ID , Please Try With Another ID";
      return next(error);
    }
    const user = await User.findById(req.userID);
    console.log(user);
    user.favoriteRecipes.push(recipe);
    console.log(user);

    let currentUser = await user.save();
    return res.status(200).json({
      Message: "Added recipe to favorite recipes",
      Data: user.favoriteRecipes,
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
exports.addRecipeToRated = async (req, res, next) => {
  try {
    const { recipe_id, rate } = req.body;
    console.log(req.body);
    if (!recipe_id) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Recipe With This ID , Please Try With Another ID";
      return next(error);
    }
    const user = await User.findById(req.userID);
    console.log("user", user);
    user.ratedRecipes.push(req.body);
    console.log(user);

    let currentUser = await user.save();
    return res.status(200).json({
      Message: "Added recipe to rated recipes",
      Data: user.ratedRecipes,
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
    const foundPost = req.params.recipeID;
    console.log(req.params);
    if (!foundPost) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Recipe With This ID , Please Try With Another ID";
      return next(error);
    }
    let userFavorites = await User.findByIdAndUpdate(req.userID, {
      $pull: { favoriteRecipes: req.params.recipeID },
    });
    console.log("User favorites", userFavorites);
    return res.status(200).json({
      Message: "Removed reipe from favorite recipes",
      Data: userFavorites.favoriteRecipes,
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
