import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles } from 'lucide-react';

const AIGradingComponent = ({ submission, assignmentTitle }) => {
  const [grade, setGrade] = useState(submission.grade || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  const handleAIGrade = async () => {
    setIsLoadingAI(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const gradingData = {
        question: assignmentTitle,
        rubric: 'Evaluate clarity, correctness, and completeness. Be constructive.',
        studentAnswer: submission.content,
      };

      const { data } = await axios.post(`${base}/api/ai/grade-submission`, gradingData, config);
      setGrade(data.score);
      setFeedback(`${data.feedback}\n\nStrengths: ${data.strengths}\n\nAreas for Improvement: ${data.areasForImprovement}`);
    } catch (error) {
      console.error('AI Grading failed', error);
      setFeedback('AI grading failed. Please grade manually.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${base}/api/submissions/${submission._id}/grade`, { grade, feedback }, config);
      alert('Grade submitted successfully!');
    } catch (error) {
      console.error('Failed to submit grade', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white/10 rounded-lg">
      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm">Grade (0-100)</label>
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full mt-1 p-2 bg-white/5 border border-white/20 rounded-lg text-white"
            />
          </div>
          <button
            type="button"
            onClick={handleAIGrade}
            disabled={isLoadingAI}
            className="self-end px-4 py-2 flex items-center gap-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            <Sparkles size={18} />
            {isLoadingAI ? 'Thinking...' : 'Grade with AI'}
          </button>
        </div>
        <div>
          <label className="text-sm">Feedback</label>
          <textarea
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full mt-1 p-2 bg-white/5 border border-white/20 rounded-lg text-white"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Submit Grade & Feedback'}
        </button>
      </form>
    </div>
  );
};

export default AIGradingComponent;
