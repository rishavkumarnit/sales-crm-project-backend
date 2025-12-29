const Lead = require("../models/Lead");
const Employee = require("../models/Employee");
const { createUserActivity } = require("./userActivityController");
const {createAdminActivity} = require("./adminActivityController");

const getLeads = async (req, res) => {
  try {
    const leadData = await Lead.find().sort({
      createdAt: -1,
    });
    res.status(200).json(leadData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const assignEmployee = async (language) => {
  try {
    const employees = await Employee.find({ preferredlanguage: language }).sort(
      {
        assignedleads: -1,
      }
    );
    if (!employees.length) return null;
    let idSelected = employees[0]._id;
    for (const employee of employees) {
      if (employee.assignedleads % 3 != 0) {
        await Employee.findByIdAndUpdate(employee._id, {
          $inc: { assignedleads: 1 },
        });
        return employee._id;
      }
      idSelected = employee._id;
    }
    await Employee.findByIdAndUpdate(idSelected, {
      $inc: { assignedleads: 1 },
    });
    return idSelected;
  } catch (err) {
  }
};

const createLead = async (req, res) => {
  const leadExists = await Lead.findOne({ email: req.body.email });
  if (leadExists) {
    return res.status(400).json({ error: "Lead with email exists" });
  }

  const assignedto = await assignEmployee(req.body.preferredlanguage);
  if(assignedto){
  await createUserActivity({
    userId: assignedto,
    message: `You were assigned a lead`,
    type: "lead_assigned",
  });
}
  const employee = await Employee.findById(assignedto);
  if(employee){
  await createAdminActivity({
    message: `You assigned a lead to ${employee.firstname} ${employee.lastname}`,
    type: "lead_assigned",
    meta: { lead: req.body.name, employeeId: assignedto },
  });
}
  const assignedat = new Date();
  try {
    const newLead = new Lead({
      ...req.body,
      assignedto,
      assignedat,
    });
    const leadData = await newLead.save();
    res.status(201).json(leadData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const editLead = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    if (req.body.employeeId) {
      if (req?.body?.status === "Closed" && lead.status === "Ongoing") {
        await Employee.findByIdAndUpdate(req.body.employeeId, {
          $inc: { closedleads: 1 },
        });
      }
    }
    if (req.body.employeeId) {
      if (req?.body?.status === "Ongoing" && lead.status === "Closed") {
        return res.status(400).json({ error: "Can't open closed lead" });
      }
    }
    if (lead.status === "Ongoing" && updates.status === "Closed") {
      await createUserActivity({
        userId: lead.assignedto,
        message: `You have closed the lead`,
        type: "deal_closed",
      });
      const employee = await Employee.findById(lead.assignedto);
      await createAdminActivity({
        message: `${employee.firstname} ${employee.lastname} closed a lead`,
        type: "deal_closed",
        meta: { lead: lead.name, employeeId: lead.assignedto },
      });
    }
    const updatedLead = await Lead.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json(updatedLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const id = req.params.id;
    const lead = await Lead.findByIdAndDelete({ _id: id });
    res.status(200).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getLeadsPaginated = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 11;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;
  try {
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).json({
      data: leads,
      total,
    });
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
};

const getMyLeads = async (req, res) => {
  const search = req.query.search || "";
  try {
    const { employeeId } = req.params;

    const filter = {
      assignedto: employeeId,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    const leads = await Lead.find(filter).sort({ scheduleddate: -1 });
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  editLead,
  deleteLead,
  getLeadsPaginated,
  getMyLeads,
};
