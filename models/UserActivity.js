const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    message: String,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);
