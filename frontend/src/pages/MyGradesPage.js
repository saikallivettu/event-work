import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';

const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const MyGradesPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageGrade, setAverageGrade] = useState(0);

  useEffect(() => {
    const fetchMySubmissions = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${apiBase}/api/submissions/my-submissions`, config);
        setSubmissions(data || []);

        const gradedSubs = data.filter((s) => s.status === 'graded' && s.grade != null);
        if (gradedSubs.length > 0) {
          const total = gradedSubs.reduce((acc, sub) => acc + sub.grade, 0);
          setAverageGrade(Math.round(total / gradedSubs.length));
        }
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMySubmissions();
  }, []);

  if (loading) return <div className="text-center p-10">Loading your grades...</div>;

  return (
    <div className="p-6 md:p-10 text-white">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold">My Grades & Feedback</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-6 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-lg flex items-center gap-6"
      >
        <div className="p-4 bg-purple-500/20 rounded-xl">
          <BarChart2 size={32} className="text-purple-300" />
        </div>
        <div>
          <p className="text-gray-300">Your Average Grade</p>
          <p className="text-4xl font-bold">{averageGrade}%</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 space-y-4">
        {submissions.map((sub) => (
          <div key={sub._id} className="bg-black/20 p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">{sub.assignment?.course?.title}</p>
                <h2 className="text-xl font-bold">{sub.assignment?.title}</h2>
              </div>
              {sub.status === 'graded' ? (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Grade</p>
                  <p className="text-3xl font-bold text-green-400">{sub.grade}/100</p>
                </div>
              ) : (
                <p className="px-3 py-1 bg-yellow-500/10 text-yellow-300 text-sm rounded-full">Submitted</p>
              )}
            </div>
            {sub.status === 'graded' && sub.feedback && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="font-semibold text-purple-300">Teacher Feedback:</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{sub.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MyGradesPage;
