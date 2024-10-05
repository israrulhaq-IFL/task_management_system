const SubDepartment = require('../models/subDepartmentModel');

exports.createSubDepartment = (req, res) => {
  const subDepartmentData = req.body;
  SubDepartment.create(subDepartmentData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Sub-department created successfully', subDepartmentId: result.insertId });
  });
};

exports.getSubDepartmentById = (req, res) => {
  const subDepartmentId = req.params.id;
  SubDepartment.getById(subDepartmentId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};

exports.getAllSubDepartments = (req, res) => {
  SubDepartment.getAll((err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};

exports.updateSubDepartment = (req, res) => {
  const subDepartmentId = req.params.id;
  const subDepartmentData = req.body;
  SubDepartment.update(subDepartmentId, subDepartmentData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Sub-department updated successfully' });
  });
};

exports.deleteSubDepartment = (req, res) => {
  const subDepartmentId = req.params.id;
  SubDepartment.delete(subDepartmentId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Sub-department deleted successfully' });
  });
};