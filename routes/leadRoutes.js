const express = require("express");
const admin = require("../models/Admin");
const router = express.Router();
const {
  getLeads,
  createLead,
  editLead,
  getLeadsPaginated,
  getMyLeads
} = require("../controllers/leadController");

router.get("/", getLeadsPaginated);

router.post("/", createLead);

router.put("/:id", editLead);

router.get("/all", getLeads)

router.get("/my-leads/:employeeId", getMyLeads);

module.exports = router;
