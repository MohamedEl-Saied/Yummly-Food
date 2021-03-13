const { number } = require("@hapi/joi");
const mongoose = require("mongoose");
const RecipeRatingSchema = mongoose.Schema({
  recipe_id: {
    type: String,
    required: true,
  },
  rating_5: {
    type: Number,
    default: 0,
  },
  rating_4: {
    type: Number,
    default: 0,
  },
  rating_3: {
    type: Number,
    default: 0,
  },
  rating_2: {
    type: Number,
    default: 0,
  },
  rating_1: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      review: { type: String, required: true },
    },
  ],
});
module.exports = mongoose.model("Recipe", RecipeRatingSchema);
