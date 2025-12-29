const AdminActivity = require("../models/AdminActivity");

const createAdminActivity = async ({ message, type, meta = {} }) => {
  try {
    await AdminActivity.create({ message, type, meta });
  } catch (err) {
    console.error("AdminActivity error:", err.message);
  }
};

const getAdminActivity = async (req, res) => {
  try {
    const activity = await AdminActivity.find()
      .sort({ createdAt: -1 })
      .limit(7);

    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin activity" });
  }
};

module.exports = {
  createAdminActivity,
  getAdminActivity,
};
