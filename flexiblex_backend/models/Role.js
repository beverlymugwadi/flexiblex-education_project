const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    enum: ['admin', 'teacher', 'student']
  },
  permissions: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: [true, 'Role description is required']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);