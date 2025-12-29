const mongoose = require("mongoose");

const leadSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    source: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    preferredlanguage: {
      type: String,
      required: true,
    },
    assignedto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    assignedat: {
      type: Date,
    },
    status: {
      type: String,
      default: "Ongoing",
    },
    type: {
      type: String,
      default: "-",
    },
    scheduleddate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
leadSchema.index({ preferredlanguage: 1 });
leadSchema.index({ assignedto: 1 });
leadSchema.index({ status: 1 });
const Lead = new mongoose.model("lead", leadSchema);
module.exports = Lead;
