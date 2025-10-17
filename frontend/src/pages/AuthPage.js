// This is the full, working component for your UI.
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Users } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AuthPage = () => {
  const [isRegisterView, setIsRegisterView] = useState(false);
  const { login } = useContext(AuthContext);

  // State for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
      if (isRegisterView) {
        const userData = { username, email, password, role };
        response = await axios.post(`${base}/api/auth/register`, userData);
      } else {
        response = await axios.post(`${base}/api/auth/login`, { email, password });
      }
      login(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputContainerStyle = 'relative mb-6';
  const inputStyle = 'w-full p-3 pl-12 bg-white/10 border border-white/20 rounded-lg backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300';
  const iconStyle = 'absolute left-4 top-1/2 -translate-y-1/2 text-white/50';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        key={isRegisterView ? 'register' : 'login'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-8 space-y-6 bg-black/20 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-wider">
            {isRegisterView ? 'Create Account' : 'Welcome Back'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {isRegisterView && (
            <div className={inputContainerStyle}>
              <User className={iconStyle} size={20} />
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputStyle} />
            </div>
          )}

          <div className={inputContainerStyle}>
            <Mail className={iconStyle} size={20} />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputStyle} />
          </div>

          <div className={inputContainerStyle}>
            <Lock className={iconStyle} size={20} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputStyle} />
          </div>

          {isRegisterView && (
            <div className="flex gap-4">
              {['student', 'teacher'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 p-3 rounded-lg transition-all text-white font-semibold border-2 ${
                    role === r ? 'bg-purple-500/50 border-purple-400' : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isRegisterView ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-300">
          {isRegisterView ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => {
              setIsRegisterView(!isRegisterView);
              setError('');
            }}
            className="font-semibold text-purple-400 hover:underline"
          >
            {isRegisterView ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
