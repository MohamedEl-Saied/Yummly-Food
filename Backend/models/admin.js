const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add posts and commnets

module.exports = mongoose.model("Admin", AdminSchema);
