const express = require('express');
const router = express.Router();
const { getAssignments, createAssignment, getAssignmentById, updateAssignment, deleteAssignment, submitAssignment } = require('../controllers/assignmentController');
const { protect, isTeacher } = require('../middleware/authMiddleware');
const { uploadSubmission } = require('../middleware/uploadMiddleware');
const { getSubmissionsForAssignment } = require('../controllers/submissionController');

router.get('/', protect, getAssignments);
router.post('/', protect, isTeacher, createAssignment);
router.get('/:id', protect, getAssignmentById);
router.put('/:id', protect, isTeacher, updateAssignment);
router.delete('/:id', protect, isTeacher, deleteAssignment);
router.post('/:id/submit', protect, uploadSubmission, submitAssignment);
router.get('/:assignmentId/submissions', protect, isTeacher, getSubmissionsForAssignment);

module.exports = router;
