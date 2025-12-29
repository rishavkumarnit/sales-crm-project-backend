const Admin = require("../models/Admin");

const getAdmin = async (req, res) => {
  try {
    const adminData = await Admin.find();
    res.status(200).json(adminData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const editAdmin = async (req, res) => {
  try {

    const { email, firstname, lastname, password } = req.body;
    const adminData = await Admin.findOneAndUpdate(
      { email }, 
      { firstname, lastname, password },
      { new: true, runValidators: true }
    );
    res.status(200).json(adminData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAdmin,
  editAdmin,
};
