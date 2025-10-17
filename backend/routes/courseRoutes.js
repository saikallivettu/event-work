const express = require('express');
const router = express.Router();

const { getCourses, createCourse, getCourseById, enrollInCourse } = require('../controllers/courseController');
const { getAssignmentsForCourse } = require('../controllers/assignmentController');
const { protect, isTeacher } = require('../middleware/authMiddleware');

// Get all courses
router.get('/', protect, getCourses);

// Create a course (teacher only)
router.post('/', protect, isTeacher, createCourse);

// Get a single course by ID (protected)
router.get('/:id', protect, getCourseById);

// Enroll current user in a course (protected)
router.post('/:id/enroll', protect, enrollInCourse);

// Get all assignments for a course (protected)
router.get('/:courseId/assignments', protect, getAssignmentsForCourse);

module.exports = router;
