const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = mongoose.Schema(
  {
    initials: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    preferredlanguage: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    assignedleads: {
      type: Number,
      default: 0,
    },
    closedleads: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "inactive",
    },
  },
  { timestamps: true }
);

employeeSchema.index({ preferredlanguage: 1 });
employeeSchema.index({ status: 1 });
const Employee = new mongoose.model("employee", employeeSchema);
module.exports = Employee;
