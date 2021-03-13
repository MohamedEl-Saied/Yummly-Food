const router = require("express").Router();
const commentControllers = require("../controllers/commentControllers");
const isAuth = require("../middleware/is-auth");

// get all comments
router.get("/get-comments", isAuth, commentControllers.getComments);
// get comment
router.get("/get-comment/:commentID", isAuth, commentControllers.getComment);
// create comment
router.post(
  "/:postId/create-comment",
  isAuth,
  commentControllers.createComment
);
// edit comment
router.put(
  "/:postId/edit-comment/:commentId",
  isAuth,
  commentControllers.editComment
);

// edit comment without post id !!!
router.put("/edit-comment/:commentId", isAuth, commentControllers.editComment);
// delete comment
router.delete(
  "/:postId/delete-comment/:commentId",
  isAuth,
  commentControllers.deleteComment
);
// delete comment without id !!
router.delete(
  "/delete-comment/:commentId",
  isAuth,
  commentControllers.deleteComment
);
module.exports = router;
