const multer = require('multer');
const path = require('path');

// Common file type check
function checkFileType(file, cb, allowed) {
  const filetypes = allowed;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype || extname) {
    return cb(null, true);
  }
  cb('Error: File type not allowed!');
}

// Submission uploader (student uploads)
const submissionStorage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const uploadSubmission = multer({
  storage: submissionStorage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    // Allow common document/image types
    checkFileType(file, cb, /jpeg|jpg|png|pdf|doc|docx|txt/);
  },
}).single('submissionFile');

// Summarizer uploader (PDF/TXT only)
const summarizerStorage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `summary-doc-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadForSummarizer = multer({
  storage: summarizerStorage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb, /pdf|txt/);
  },
}).single('document');

module.exports = { uploadSubmission, uploadForSummarizer };
