const Student = require('../models/Student');
const Course = require('../models/Course');
const User = require('../models/User');
const Role = require('../models/Role');

const adminController = {
  createStudent: async (req, res) => {
    try {
      const studentData = req.body;
      
      // Check if student already exists
      const existingStudent = await Student.findOne({ 
        $or: [
          { email: studentData.email },
          { registrationNumber: studentData.registrationNumber }
        ]
      });

      if (existingStudent) {
        return res.status(409).json({ 
          success: false, 
          message: 'Student already exists with this email or registration number' 
        });
      }

      const student = new Student(studentData);
      await student.save();

      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating student',
        error: error.message
      });
    }
  },

  deleteStudent: async (req, res) => {
    try {
      const { studentId } = req.params;
      
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      await Student.findByIdAndDelete(studentId);

      res.json({
        success: true,
        message: 'Student deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting student',
        error: error.message
      });
    }
  },

  generateReport: async (req, res) => {
    try {
      const { reportType, filters = {} } = req.body;

      let reportData;
      switch (reportType) {
        case 'students':
          reportData = await Student.find(filters)
            .populate('courses', 'courseName');
          break;
        case 'courses':
          reportData = await Course.find(filters)
            .populate('enrolledStudents', 'names email');
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid report type'
          });
      }

      res.json({
        success: true,
        data: reportData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generating report',
        error: error.message
      });
    }
  },

  addCourse: async (req, res) => {
    try {
      const { courseName, description, duration } = req.body;

      const existingCourse = await Course.findOne({ courseName });
      if (existingCourse) {
        return res.status(409).json({
          success: false,
          message: 'Course already exists'
        });
      }

      const course = new Course({ courseName, description, duration });
      await course.save();

      res.status(201).json({
        success: true,
        message: 'Course added successfully',
        data: course
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding course',
        error: error.message
      });
    }
  },

  assignRole: async (req, res) => {
    try {
      const { userId, roleId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      user.userType = role.roleName;
      await user.save();

      res.json({
        success: true,
        message: 'Role assigned successfully',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error assigning role',
        error: error.message
      });
    }
  },

  bulkAssignPermissions: async (req, res) => {
    try {
      // Handle bulk permissions assignment logic here
      const { permissions } = req.body;

      // Example: Assume we need to assign these permissions to roles
      // Your logic will depend on the structure of the permissions
      for (let perm of permissions) {
        const role = await Role.findById(perm.roleId);
        if (role) {
          role.permissions = [...role.permissions, ...perm.permissions];
          await role.save();
        }
      }

      res.json({
        success: true,
        message: 'Bulk permissions assigned successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error assigning bulk permissions',
        error: error.message
      });
    }
  }
};

module.exports = adminController;
