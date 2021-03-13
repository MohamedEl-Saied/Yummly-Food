const router = require("express").Router();
const isAuth = require("../middleware/is-auth");
const isBlocked = require("../middleware/is-blocked");
const userControllers = require("../controllers/userControllers");
// register route => POST

router.post("/register", userControllers.createUser);
router.post("/login", userControllers.loginUser);
router.get("/get-user/:userId", userControllers.getUser);
router.get(
  "/get-user-by-username/:username",
  userControllers.getUsersByUsername
);
router.put("/edit-user/:userId", isAuth, userControllers.editUser);

router.delete("/delete-user/:userId", isAuth, userControllers.deleteUser);
router.get("/show", userControllers.getUsers);
// block or unblock user
router.put("/block-user/:userId", isAuth, userControllers.blockUser);
// feedback
router.post("/feedback", userControllers.createFeedBack);
router.get(
  "/get-feedback-messages",
  isAuth,
  userControllers.getFeedbackMessages
);

router.delete("/feedback/:id", isAuth, userControllers.deleteFeedback);
module.exports = router;
