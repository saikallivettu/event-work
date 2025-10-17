const express = require('express');
const router = express.Router();
const { gradeSubmission, handleChat, summarizeDocument } = require('../controllers/aiController');
const { protect, isTeacher } = require('../middleware/authMiddleware');
const { uploadForSummarizer } = require('../middleware/uploadMiddleware');

// AI Auto-Grading endpoint (teacher only)
router.post('/grade-submission', protect, isTeacher, gradeSubmission);

// Conversational chat with course context
router.post('/chat', protect, handleChat);

// Summarize uploaded document (PDF/TXT)
router.post('/summarize', protect, uploadForSummarizer, summarizeDocument);

module.exports = router;
