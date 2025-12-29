const express = require("express");
const admin = require("../models/Admin");
const router = express.Router();
const {
  getAdmin,
  editAdmin,
} = require("../controllers/adminController");


router.get("/", getAdmin);

router.post("/", editAdmin);

module.exports = router;
