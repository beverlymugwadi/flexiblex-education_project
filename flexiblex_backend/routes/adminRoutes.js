const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');

// Use authMiddleware and checkRole middleware for all routes
router.use(authMiddleware, checkRole(['admin']));

// Define routes and associate them with controller methods
router.post('/students', adminController.createStudent);
router.delete('/students/:studentId', adminController.deleteStudent);
router.post('/reports', adminController.generateReport);
router.post('/courses', adminController.addCourse);
router.post('/roles/assign', adminController.assignRole);
router.post('/permissions/bulk', adminController.bulkAssignPermissions);

module.exports = router;
