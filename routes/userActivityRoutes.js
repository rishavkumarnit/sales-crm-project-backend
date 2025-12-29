const router = require("express").Router();
const {
  getUserActivity
} = require("../controllers/userActivityController");

router.get("/:userId", getUserActivity);

module.exports = router;
