const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

const today = () => new Date().toISOString().split("T")[0];

const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const date = today();

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    if (employee.status === "active")
      return res.status(400).json({ error: "Already checked in today" });

    let record = await Attendance.findOne({ employeeId, date });

    if (record?.checkIn)
      return res.status(400).json({ error: "Already checked in today" });

    if (!record) {
      record = await Attendance.create({
        employeeId,
        date,
        checkIn: new Date(),
      });
    } else {
      record.checkIn = new Date();
      await record.save();
    }

    employee.status = "active";
    await employee.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkOut = async (req, res) => {
  const { employeeId } = req.body;
  const date = today();

  const record = await Attendance.findOne({ employeeId, date });
//   if (!record?.checkIn)
//     return res.status(400).json({ error: "Check-in first" });

  if (record.breakStart && !record.breakEnd)
    return res.status(400).json({ error: "End break before checkout" });

  if (record.checkOut)
    return res.status(400).json({ error: "Already checked out" });

  record.checkOut = new Date();
  await record.save();

  await Employee.findByIdAndUpdate(employeeId, { status: "inactive" });

  res.json(record);
};

const startBreak = async (req, res) => {
  const { employeeId } = req.body;
  const date = today();

  const record = await Attendance.findOne({ employeeId, date });
  if (!record?.checkIn)
    return res.status(400).json({ error: "Check-in first" });

  if (record.breakStart)
    return res.status(400).json({ error: "Break already used today" });

  if (record.checkOut)
    return res.status(400).json({ error: "Already checked out" });

  record.breakStart = new Date();
  await record.save();

  res.json(record);
};

const endBreak = async (req, res) => {
  const { employeeId } = req.body;
  const date = today();

  const record = await Attendance.findOne({ employeeId, date });
  if (!record?.breakStart || record.breakEnd)
    return res.status(400).json({ error: "No active break" });

  record.breakEnd = new Date();
  await record.save();

  res.json(record);
};

const getDashboardAttendance = async (req, res) => {
  const { employeeId } = req.params;
  const date = today();

  const todayRecord = await Attendance.findOne({ employeeId, date });

  const last4 = await Attendance.find({
    employeeId,
    breakStart: { $exists: true },
  })
    .sort({ date: -1 })
    .limit(4);
  res.json({ today: todayRecord, last4 });
};

module.exports = {
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getDashboardAttendance,
};
