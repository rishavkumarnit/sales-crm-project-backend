const Employee = require("../models/Employee");
const mongoose = require("mongoose");

const getEmployees = async (req, res) => {
  console.log("DASHBOARD ACCESSED FOR ACTIVE USERS");
  const search = req.query.search || "";
  try {
    const searchQueries = [
      { firstname: { $regex: search, $options: "i" } },
      { lastname: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
    if (mongoose.Types.ObjectId.isValid(search)) {
      searchQueries.push({ _id: search });
    }
    const query = { $or: searchQueries };

    const queryWithActiveStatus = {
      ...query,
      status: "active",
    };
    const employeeData = await Employee.find(queryWithActiveStatus).sort({
      createdAt: -1,
    });
    res.status(200).json(employeeData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginEmployee = async (req, res) => {
  const { email, password } = req.body;
  const employee = await Employee.findOne({ email });
  if (!employee) {
    return res.status(401).json({ error: "Email not registered" });
  }
  if (employee.password !== password) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  res.status(200).json({
    email: employee.email,
    firstname: employee.firstname,
    lastname: employee.lastname,
    id: employee._id,
    password: employee.password,
  });
};

const createEmployee = async (req, res) => {
  const {
    initials,
    firstname,
    lastname,
    email,
    location,
    preferredlanguage,
    password,
  } = req.body;
  try {
    const newEmployee = new Employee({
      initials,
      firstname,
      lastname,
      email,
      location,
      preferredlanguage,
      password,
    });
    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ error: "Employee with email exists" });
    }
    const employeeData = await newEmployee.save();
    res.status(201).json(employeeData._id);
  } catch (err) {

    res.status(400).json({ error: err.message });
  }
};

const editEmployee = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const employee = await Employee.findOneAndUpdate({ email }, req.body, {
      new: true,
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findByIdAndDelete({ _id: id });
    res.status(200).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getEmployeesPaginated = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;
  try {
    const searchQueries = [
      { firstname: { $regex: search, $options: "i" } },
      { lastname: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
    if (mongoose.Types.ObjectId.isValid(search)) {
      searchQueries.push({ _id: search });
    }
    const query = { $or: searchQueries };
    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).json({
      data: employees,
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById({ _id: id });
    res.status(200).json({
      email: employee.email,
      firstname: employee.firstname,
      lastname: employee.lastname,
      id: employee._id,
      password: employee.password,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = {
  getEmployees,
  loginEmployee,
  // signupEmployee,
  createEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeesPaginated,
  getEmployeeById,
};
