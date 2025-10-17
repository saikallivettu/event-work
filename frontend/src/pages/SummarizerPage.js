import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Sparkles } from 'lucide-react';
import axios from 'axios';

const SummarizerPage = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSummarize = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setError('');
    setLoading(true);
    setSummary('');

    const formData = new FormData();
    formData.append('document', file);

    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`${base}/api/ai/summarize`, formData, config);
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 text-white">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold">AI Document Summarizer</h1>
        <p className="text-gray-300 text-lg mt-1">Upload your notes or articles (PDF/TXT) to get key insights instantly.</p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-black/20 p-8 rounded-2xl border border-white/10 backdrop-blur-lg h-full flex flex-col justify-between">
            <div>
              <label htmlFor="doc-upload" className="cursor-pointer border-2 border-dashed border-white/20 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
                <UploadCloud size={48} className="text-gray-400 mb-2" />
                <p className="text-white font-semibold">{file ? file.name : 'Click to upload or drag & drop'}</p>
                <p className="text-sm text-gray-400">PDF or TXT, up to 10MB</p>
              </label>
              <input id="doc-upload" type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileChange} />
            </div>
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            <button onClick={handleSummarize} disabled={loading || !file} className="mt-6 w-full py-3 flex items-center justify-center gap-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:scale-105 transform transition-all disabled:opacity-50 disabled:scale-100">
              <Sparkles size={20} />
              {loading ? 'Analyzing Document...' : 'Generate Summary'}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-black/20 p-8 rounded-2xl border border-white/10 backdrop-blur-lg h-full min-h-[300px]">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={24} className="text-purple-300" />
              <h2 className="text-2xl font-bold">Your Summary</h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-gray-400">Working...</div>
              </div>
            ) : (
              <div className="prose prose-invert">
                {summary ? <pre className="whitespace-pre-wrap font-sans">{summary}</pre> : <p>Your generated summary will appear here.</p>}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SummarizerPage;
