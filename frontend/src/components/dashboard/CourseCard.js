import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const { title, teacher, progress } = course;

  return (
    <Link to={`/courses/${course._id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-black/20 p-6 rounded-2xl border border-white/10 backdrop-blur-lg shadow-2xl overflow-hidden h-full flex flex-col justify-between"
      >
        <div className="relative">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-gray-400 mt-1">by {teacher?.username || teacher || 'Unknown'}</p>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-300">Progress</span>
              <span className="text-sm font-bold text-purple-300">{progress ?? 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
          </div>

          <div className="absolute -top-1/2 -right-1/2 w-80 h-80 bg-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl" />
        </div>
        <div className="mt-6 text-center py-2 font-semibold text-white bg-white/10 rounded-lg border border-white/20 group-hover:bg-white/20 transition-all">
          View Details
        </div>
      </motion.div>
    </Link>
  );
};

export default CourseCard;
