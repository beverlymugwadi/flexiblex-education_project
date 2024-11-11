const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Apply auth middleware to all routes
router.use(authMiddleware);

// Define routes and associate them with controller methods
router.post('/register', upload.single('photo'), studentController.createStudent);
router.get('/:id', studentController.getStudentById);
router.get('/', studentController.getAllStudents);
router.post('/:id/profile-change-request', checkRole(['student', 'admin']), studentController.requestProfileChange);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
