const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['submitted', 'graded'], default: 'submitted' },
  grade: { type: Number, min: 0, max: 100 },
  feedback: { type: String },
  // New unified content field, keep legacy 'text' for compatibility
  content: { type: String },
  text: { type: String },
  fileUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
