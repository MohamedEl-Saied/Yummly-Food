const router = require("express").Router();
const isAuth = require("../middleware/is-auth");
const ratingRecipesControllers = require("../controllers/recipeRatingControllers");
router.get(
  "/get-recipe-rating/:recipe_id",
  ratingRecipesControllers.getAndCreateRating
);
router.put(
  "/update-recipe-rating/:recipe_id",
  ratingRecipesControllers.updateRating
);
router.post(
  "/add-review/:recipe_id",
  isAuth,
  ratingRecipesControllers.addReview
);
module.exports = router;
