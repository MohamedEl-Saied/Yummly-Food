const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://osama:osamaa123@cluster0.h5owg.mongodb.net/newDB", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected successfully!!!");
  })
  .catch((err) => console.log(err));

const db = mongoose.connection;
module.exports = db;
