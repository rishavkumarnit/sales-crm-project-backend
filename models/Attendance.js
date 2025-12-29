const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    checkIn: Date,
    checkOut: Date,
    breakStart: Date,
    breakEnd: Date,
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("attendance", attendanceSchema);
