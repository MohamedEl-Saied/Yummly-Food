const router = require("express").Router();
const postControllers = require("../controllers/postControllers");
const isAuth = require("../middleware/is-auth");
// get all posts
router.get("/show", isAuth, postControllers.getPosts);
// create a new post
router.post("/create", isAuth, postControllers.createPost);
// show one post
router.get("/show/:postId", isAuth, postControllers.showPost);
// edit post
router.put("/edit/:postId", isAuth, postControllers.editPost);
// add or remove like
router.post("/like/:postId", isAuth, postControllers.addOrRemoveLike);
// delete post
router.delete("/delete/:postId", isAuth, postControllers.deletePost);
router.post("/add-to-favorite/:postId", isAuth, postControllers.addToFavorite);
router.put(
  "/remove-from-favorite/:postId",
  isAuth,
  postControllers.removeFromFavorite
);
module.exports = router;
