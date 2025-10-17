import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AIGradingComponent from '../components/features/AIGradingComponent';

const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const SubmissionsPage = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${apiBase}/api/assignments/${assignmentId}/submissions`, config);
        setSubmissions(data || []);
        // Optionally fetch assignment details here for real title
        setTitle('Assignment');
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  if (loading) return <div className="text-white p-6">Loading submissions...</div>;

  return (
    <div className="p-6 md:p-10 text-white">
      <h1 className="text-4xl font-bold">Submissions for {title}</h1>
      <div className="mt-8 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-lg p-6">
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission._id} className="border-b border-white/10 py-4 last:border-b-0">
              <h3 className="font-semibold text-xl">{submission.student?.username}</h3>
              <p className="text-gray-400 mt-2">Submitted Content: {submission.content || 'File attached'}</p>
              <AIGradingComponent submission={submission} assignmentTitle={title} />
            </div>
          ))
        ) : (
          <p>No submissions yet.</p>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;
