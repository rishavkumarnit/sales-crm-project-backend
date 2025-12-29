// routes/adminActivityRoutes.js
const router = require("express").Router();
const { getAdminActivity } = require("../controllers/adminActivityController");

router.get("/", getAdminActivity);
module.exports = router;
