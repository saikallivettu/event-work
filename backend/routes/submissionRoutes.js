const express = require('express');
const router = express.Router();
const { gradeSubmission, getMySubmissions } = require('../controllers/submissionController');
const { protect, isTeacher } = require('../middleware/authMiddleware');

// Student: get own submissions (place before :id routes)
router.get('/my-submissions', protect, getMySubmissions);

router.post('/:id/grade', protect, isTeacher, gradeSubmission);

module.exports = router;
