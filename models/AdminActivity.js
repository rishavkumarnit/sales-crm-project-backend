
const mongoose = require("mongoose");

const adminActivitySchema = new mongoose.Schema(
  {
    message: String,
    type: String,   
    meta: Object    
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminActivity", adminActivitySchema);
