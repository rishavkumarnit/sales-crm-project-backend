const express = require("express");
const router = express.Router();
const {
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getDashboardAttendance,
} = require("../controllers/attendanceController");

router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.post("/break/start", startBreak);
router.post("/break/end", endBreak);
router.get("/dashboard/:employeeId", getDashboardAttendance);

module.exports = router;
