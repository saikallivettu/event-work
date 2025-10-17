import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud } from 'lucide-react';
import axios from 'axios';

const AssignmentSubmissionModal = ({ isOpen, onClose, assignment, onWorkSubmitted }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !file) {
      setError('You must either type an answer or upload a file.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) formData.append('submissionFile', file);

      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
      await axios.post(`${base}/api/assignments/${assignment._id}/submit`, formData, config);

      onWorkSubmitted?.(assignment._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full max-w-lg bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-white mb-2">Submit Assignment</h2>
          <p className="text-gray-300 mb-6">For: <span className="font-semibold">{assignment?.title}</span></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows="8"
              placeholder="Type your answer here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            ></textarea>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:bg-white/5">
              <input id="fileUpload" type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <label htmlFor="fileUpload" className="cursor-pointer block">
                <UploadCloud size={48} className="text-gray-400 mb-2 mx-auto" />
                <p className="text-white font-semibold">{file ? file.name : 'Click to upload or drag & drop'}</p>
                <p className="text-sm text-gray-400">PDF, DOCX, TXT (MAX. 10MB)</p>
              </label>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading} className="mt-6 w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:scale-105 transform transition-all disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Work'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssignmentSubmissionModal;
