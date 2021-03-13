const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const Verifier = require("email-verifier");
const app = express();
const db = require("./db/config");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const adminRoutes = require("./routes/adminRoutes");
const commentRoutes = require("./routes/commentRoutes");
const ratingRoutes = require("./routes/rating");
const path = require("path");
// const app = express();
const apiPort = 5000;
const favoriteRecipesRoutes = require("./routes/favorites");

// multer for upload images
const multer = require("multer");
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/user", userRoutes);
app.use("/post", postRoutes, commentRoutes);
app.use("/admin", adminRoutes);
app.use("/favorites", favoriteRecipesRoutes);
app.use("/rating", ratingRoutes);
// app.get("/test", (req, res) => {
//   let verifier = new Verifier(
//     "at_0a3RjC2seFWDB91YL1bGtpyLE0E0F",
//     "osama.ali.gouda@gmail.com"
//   );
//   verifier.verify("magdeeeeeeeeeeeeeey@fdsfds.com", (err, data) => {
//     if (err) throw err;
//     console.log(data);
//   });
//   res.send("hi");
// });

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Something Went Wrong";
  return res
    .status(status)
    .json({ Error: message, Success: false, Data: null });
});

db.on("error", console.error.bind(console, "MongoDB connection error:")).then(
  () => {
    app.listen(apiPort, () => {
      console.log("Ya Magdeeeeeeeeeeeeeeeeeeeeeey");
    });
  }
);
