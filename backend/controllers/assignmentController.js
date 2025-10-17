const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// @desc    List assignments (optionally by course)
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    const { course } = req.query;
    const filter = course ? { course } : {};
    const assignments = await Assignment.find(filter).lean();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private (Teacher)
exports.createAssignment = async (req, res) => {
  const { title, description, dueDate, courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course || course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add assignments to this course' });
    }
    const assignment = new Assignment({ title, description, dueDate, course: courseId });
    const createdAssignment = await assignment.save();
    res.status(201).json(createdAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (teacher)
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (teacher)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all assignments for a course
// @route   GET /api/courses/:courseId/assignments
// @access  Private
exports.getAssignmentsForCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit to an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  const assignmentId = req.params.id;
  const studentId = req.user.id;
  const { content } = req.body;
  try {
    const submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      content,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await submission.save();
    await Assignment.findByIdAndUpdate(assignmentId, { $push: { submissions: submission._id } });
    res.status(201).json({ message: 'Submission successful', submission });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
