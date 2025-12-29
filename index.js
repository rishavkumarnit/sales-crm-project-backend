const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//Port
const port = process.env.Port || 4000;

//DB cnnection
require("./config/db");

//Admin routes
const adminRoutes = require("./routes/adminRoutes");

//Employee routes
const employeeRoutes = require("./routes/employeeRoutes");

//Lead routes
const leadRoutes = require("./routes/leadRoutes");

//attendance routes
const attendanceRoutes = require("./routes/attendanceRoutes");

//User activity routes
const userActivityRoutes = require("./routes/userActivityRoutes");

//Admin activity routes
const adminActivityRoutes = require("./routes/adminActivityRoutes");

//Middleware
app.use(express.json());
app.use(cors());

//Admin api
app.use("/api/admin", adminRoutes);

//Employee  api
app.use("/api/employees", employeeRoutes);

//Lead  api
app.use("/api/leads", leadRoutes);

//Attendance api
app.use("/api/attendance", attendanceRoutes);

//User activity api
app.use("/api/user-activity", userActivityRoutes);

//Admin activity api
app.use("/api/admin-activity", adminActivityRoutes);

app.listen(port, () => {
  console.log(`Server is runnning at ${port}`);
});
