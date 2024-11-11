const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  names: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot be more than 150']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  class: {
    type: String,
    required: [true, 'Class is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  parentNames: {
    type: String,
    required: [true, 'Parent names are required']
  },
  parentContact: {
    type: String,
    required: [true, 'Parent contact is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  photoPath: {
    type: String
  },
  registrationNumber: {
    type: String,
    unique: true,
    required: [true, 'Registration number is required']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

studentSchema.index({ email: 1, registrationNumber: 1 });

module.exports = mongoose.model('Student', studentSchema);