import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import CourseCard from '../components/dashboard/CourseCard';
import AIChatDock from '../components/features/AIChatDock';
import { fetchCourses } from '../api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  useEffect(() => {
    const getCourses = async () => {
      try {
        const { data } = await fetchCourses();
        setCourses(data || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, []);

  if (loading) return <div className="text-white p-6">Loading courses...</div>;

  return (
    <div className="p-6 md:p-10 text-white">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold">Welcome back, {user?.username}!</h1>
        <p className="text-gray-300 text-lg mt-1">Here's your learning dashboard for today.</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10" variants={containerVariants} initial="hidden" animate="visible">
        {courses.map((course, index) => (
          <motion.div key={course._id || index} variants={itemVariants}>
            <CourseCard course={course} />
          </motion.div>
        ))}
        <motion.div variants={itemVariants}>
          <div className="h-full flex items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md cursor-pointer hover:bg-white/10 transition-all duration-300">
            <p className="text-lg font-semibold">+ Enroll in a New Course</p>
          </div>
        </motion.div>
      </motion.div>

      <AIChatDock />
    </div>
  );
};

export default Dashboard;
