const router = require("express").Router();
const adminControllers = require("../controllers/adminControllers");

// router.post("/sign-up", adminControllers.createAdmin);
router.post("/login", adminControllers.loginAdmin);
module.exports = router;
