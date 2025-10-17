const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// @desc    Get all submissions for a specific assignment
// @route   GET /api/assignments/:assignmentId/submissions
// @access  Private (Teacher)
exports.getSubmissionsForAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId).populate('course');
    if (!assignment || assignment.course?.teacher?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these submissions' });
    }

    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'username email');

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all submissions for the logged-in student
// @route   GET /api/submissions/my-submissions
// @access  Private (Student)
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id })
      .populate({
        path: 'assignment',
        select: 'title course',
        populate: { path: 'course', select: 'title' }
      })
      .sort({ submissionDate: -1 });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a submission with a grade and feedback
// @route   POST /api/submissions/:id/grade
// @access  Private (Teacher)
exports.gradeSubmission = async (req, res) => {
  const { grade, feedback } = req.body || {};
  try {
    const submission = await Submission.findById(req.params.id).populate({
      path: 'assignment',
      populate: { path: 'course' }
    });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    // Ensure requester is the teacher for the course
    const teacherId = submission.assignment?.course?.teacher?.toString();
    if (!teacherId || teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to grade this submission' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';

    const updated = await submission.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
