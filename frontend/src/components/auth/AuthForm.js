import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Users } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const AuthForm = ({ isRegister = false }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  // styles
  const inputContainerStyle = 'relative mb-6';
  const inputStyle = 'w-full p-3 pl-12 bg-white/10 border border-white/20 rounded-lg backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300';
  const iconStyle = 'absolute left-4 top-1/2 -translate-y-1/2 text-white/50';
  const buttonStyle = 'w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let response;
      const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
      if (isRegister) {
        response = await axios.post(`${base}/api/auth/register`, { username, email, password, role });
      } else {
        response = await axios.post(`${base}/api/auth/login`, { email, password });
      }
      login(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full max-w-md p-8 space-y-8 bg-black/20 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white tracking-wider">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-300 mt-2">
          {isRegister ? 'Join the future of learning.' : 'Log in to continue your journey.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {isRegister && (
          <div className={inputContainerStyle}>
            <User className={iconStyle} size={20} />
            <input
              type="text"
              placeholder="Username"
              className={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}

        <div className={inputContainerStyle}>
          <Mail className={iconStyle} size={20} />
          <input
            type="email"
            placeholder="Email Address"
            className={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={inputContainerStyle}>
          <Lock className={iconStyle} size={20} />
          <input
            type="password"
            placeholder="Password"
            className={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isRegister && (
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center"><Users size={16} className="mr-2"/>I am a...</label>
            <div className="flex gap-4">
              {['student', 'teacher'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 p-3 rounded-lg transition-all duration-300 text-white font-semibold border-2 ${
                    role === r
                      ? 'bg-purple-500/50 border-purple-400 shadow-lg'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <div>
          <button type="submit" className={buttonStyle}>
            <motion.span whileHover={{ letterSpacing: '1px' }}>
              {isRegister ? 'Sign Up' : 'Log In'}
            </motion.span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AuthForm;
