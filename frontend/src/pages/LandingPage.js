import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/common/AnimatedBackground';

const LandingPage = () => {
  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-white p-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Welcome to <span className="text-purple-400">GlassNeuro</span> LMS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 max-w-2xl text-lg md:text-xl text-gray-300"
        >
          The future of learning is here. An AI-powered platform designed to enhance your educational journey with intelligent tools and a stunning interface.
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <Link to="/auth" className="mt-8 inline-block px-10 py-4 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            Get Started
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default LandingPage;
