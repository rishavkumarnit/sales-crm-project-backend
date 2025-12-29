const express = require("express");
const admin = require("../models/Admin");
const router = express.Router();
const {
  getEmployees,
  loginEmployee,
  createEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeesPaginated,
  getEmployeeById
} = require("../controllers/employeeController");

router.get("/", getEmployeesPaginated);

router.post("/", createEmployee);

router.delete("/:id", deleteEmployee);

router.put("/", editEmployee);

router.get("/all", getEmployees);

router.post("/login", loginEmployee);

router.get("/:id", getEmployeeById)

module.exports = router;
