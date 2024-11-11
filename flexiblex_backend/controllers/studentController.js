const Student = require('../models/Student');
const Course = require('../models/Course');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('courses');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve students' });
  }
};

// Get a student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('courses');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the student' });
  }
};

// Create a new student
const Student = require('../models/Student');
exports.createStudent = async (req, res) => {
  try {
    const { names, age, dateOfBirth, address, class: academicclass, gender, parentNames, parentContact, email, phoneNumber, courses, registrationNumber, active } = req.body;
    const photoPath = req.file ? req.file.path : '';
    const newStudent = new Student({ names, age, dateOfBirth, address, class: academicclass, gender, parentNames, parentContact, email, phoneNumber, courses, photoPath, registrationNumber, active });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create the student', details: error.message });
  }
};


// Update a student's details
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, courses } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, courses },
      { new: true, runValidators: true }
    ).populate('courses');
    
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });
    
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update the student' });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the student' });
  }
};

// Optional profile change request function
exports.requestProfileChange = async (req, res) => {
  try {
    // Logic for handling profile change request
    res.status(200).json({ message: 'Profile change request submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to request profile change' });
  }
};
