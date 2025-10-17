const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'username').lean();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (teacher)
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.create({ title, description, teacher: req.user._id });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Private
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'username email')
      .populate('students', 'username email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Enroll the current user in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Students)
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    if (course.students.includes(req.user.id) || user.enrolledCourses.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add user to course's student list and vice-versa
    course.students.push(req.user.id);
    user.enrolledCourses.push(req.params.id);

    await course.save();
    await user.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
