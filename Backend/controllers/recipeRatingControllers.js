const Recipe = require("../models/recipe-rate");
const User = require("../models/user");

exports.updateRating = async (req, res, next) => {
  const { recipe_id } = req.body;
  const recipe = await Recipe.findOne({ recipe_id: recipe_id });
  console.log(recipe);
  try {
    if (!recipe) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Recipe With This ID , Please Try With Another ID";
      return next(error);
    } else {
      recipe.recipe_id = recipe_id;
      if (req.body.rating_5) {
        recipe.rating_5 += 1;
      } else if (req.body.rating_4) {
        recipe.rating_4 += 1;
      } else if (req.body.rating_3) {
        recipe.rating_3 += 1;
      } else if (req.body.rating_2) {
        recipe.rating_2 += 1;
      } else if (req.body.rating_1) {
        recipe.rating_1 += 1;
      }
      await recipe.save();
      return res.status(201).json({
        Data: recipe,
        Message: "Recipe Updated Successfully",
        Error: null,
        Success: true,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};
exports.getAndCreateRating = async (req, res, next) => {
  const { recipe_id } = req.params;
  console.log(req.params);
  const foundRecipe = await Recipe.findOne({ recipe_id: recipe_id }).populate({
    path: "comments",
    populate: {
      path: "user",
      model: "User",
    },
  });
  try {
    if (!foundRecipe) {
      const newRecipe = new Recipe({
        recipe_id: recipe_id,
      });
      await newRecipe.save();
      return res.status(201).json({
        Data: newRecipe,
        Message: "Recipe Created Successfully",
        Error: null,
        Success: true,
      });
    } else {
      return res.status(200).json({
        Message: "Recipe Is Found",
        Data: foundRecipe,
        Success: true,
        Error: null,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};
exports.addReview = async (req, res, next) => {
  const { recipe_id } = req.params;
  const { review } = req.body;
  const recipe = await Recipe.findOne({ recipe_id: recipe_id });
  try {
    if (!recipe) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "No Recipe With This ID , Please Try With Another ID";
      return next(error);
    } else {
      const user = await User.findById(req.userID);
      console.log("My user", user);
      let userReview = { user, review };
      console.log(userReview);
      recipe.comments.push(userReview);

      await recipe.save();
      return res.status(201).json({
        Data: userReview,
        Message: "Review Added To Recipe Successfully",
        Error: null,
        Success: true,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};
