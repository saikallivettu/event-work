import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Users, CheckCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateAssignmentModal from '../components/features/CreateAssignmentModal';
import AssignmentSubmissionModal from '../components/features/AssignmentSubmissionModal';

const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const getCourseDetails = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  return await axios.get(`${apiBase}/api/courses/${id}`, config);
};

const enrollInCourseAPI = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  return await axios.post(`${apiBase}/api/courses/${id}/enroll`, {}, config);
};

const getAssignments = async (courseId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  return await axios.get(`${apiBase}/api/courses/${courseId}/assignments`, config);
};

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await getCourseDetails(id, user.token);
        setCourse(courseRes.data);
        if (Array.isArray(courseRes.data.students) && courseRes.data.students.some((s) => s._id === user._id)) {
          setIsEnrolled(true);
        }
        const assignmentsRes = await getAssignments(id, user.token);
        setAssignments(assignmentsRes.data || []);
      } catch (err) {
        setError('Failed to load course data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user.token, user._id]);

  const handleEnroll = async () => {
    try {
      setBusy(true);
      await enrollInCourseAPI(id, user.token);
      setIsEnrolled(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleOpenSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleWorkSubmitted = (submittedAssignmentId) => {
    // Optionally refetch submissions or mark submitted
    console.log(`Work submitted for assignment ${submittedAssignmentId}`);
  };

  const handleAssignmentCreated = (newAssignment) => {
    setAssignments((prev) => [...prev, newAssignment]);
  };

  if (loading) return <div className="text-center p-10 text-white">Loading Course...</div>;
  if (error) return <div className="text-center p-10 text-red-400">{error}</div>;

  return (
    <>
    <div className="p-6 md:p-10 text-white">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl font-bold mb-2">{course?.title}</h1>
        <p className="text-xl text-gray-300">Taught by {course?.teacher?.username}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-8 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-lg"
      >
        <div className="flex items-center gap-2 mb-4 text-purple-300">
          <BookOpen />
          <h2 className="text-2xl font-semibold">Course Description</h2>
        </div>
        <p className="text-gray-300 leading-relaxed">{course?.description}</p>

        <div className="flex items-center gap-2 mt-8 text-purple-300">
          <Users />
          <h3 className="text-xl font-semibold">Enrolled Students</h3>
        </div>
        <p className="text-gray-400">{course?.students?.length || 0} students enrolled</p>

        <div className="mt-8">
          {user.role === 'student' && (
            isEnrolled ? (
              <div className="flex items-center gap-2 text-green-400 font-semibold text-lg p-4 bg-green-500/10 rounded-lg">
                <CheckCircle /> You are enrolled in this course.
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={busy}
                className="w-full md:w-auto px-8 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:scale-105 transform transition-all disabled:opacity-60"
              >
                {busy ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )
          )}
        </div>
      </motion.div>

      {/* Assignments section */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.4 }}
        className="mt-8 p-8 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Assignments</h2>
          {user.role === 'teacher' && course?.teacher?._id === user._id && (
            <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
              <PlusCircle size={20} /> Create Assignment
            </button>
          )}
        </div>

        <div className="space-y-4">
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <div key={assignment._id} className="p-4 bg-white/5 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{assignment.title}</h3>
                  <p className="text-sm text-gray-400">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {user.role === 'student' && isEnrolled && (
                    <button onClick={() => handleOpenSubmitModal(assignment)} className="px-4 py-2 text-sm font-semibold bg-white/10 rounded-md hover:bg-white/20 transition">
                      Submit Work
                    </button>
                  )}
                  {user.role === 'teacher' && course?.teacher?._id === user._id && (
                    <Link to={`/assignments/${assignment._id}/submissions`} className="px-4 py-2 text-sm font-semibold bg-white/10 rounded-md hover:bg-white/20 transition">
                      View Submissions
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No assignments have been posted for this course yet.</p>
          )}
        </div>
      </motion.div>
    </div>

    {/* Modals */}
    <CreateAssignmentModal 
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      courseId={id}
      onAssignmentCreated={handleAssignmentCreated}
    />

    <AssignmentSubmissionModal 
      isOpen={isSubmitModalOpen}
      onClose={() => setIsSubmitModalOpen(false)}
      assignment={selectedAssignment}
      onWorkSubmitted={handleWorkSubmitted}
    />
    </>
  );
};

export default CourseDetailsPage;
