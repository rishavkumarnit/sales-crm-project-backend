const UserActivity = require("../models/UserActivity");

const createUserActivity = async ({ userId, message, type }) => {

    await UserActivity.create({ userId, message, type });

};

const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const activity = await UserActivity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(4);

    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
};

module.exports = {
  createUserActivity,
  getUserActivity,
};
