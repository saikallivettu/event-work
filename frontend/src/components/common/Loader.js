import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a2e]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-t-purple-500 border-white/20 rounded-full"
      />
      <p className="text-white mt-4 text-lg">{text}</p>
    </div>
  );
};

export default Loader;
