import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import axios from 'axios';
import { useCourseContext } from '../../hooks/useCourseContext';

const AIChatDock = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const courseId = useCourseContext();
  const chatBodyRef = useRef(null);
  const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (courseId) {
      setMessages([{ sender: 'ai', text: "Hi! I'm Neuro, your AI Tutor. Ask me anything about this course." }]);
    } else {
      setMessages([{ sender: 'ai', text: 'Hi! Navigate to a course page to start chatting with me about it.' }]);
    }
  }, [courseId]);

  const handleSend = async () => {
    if (!input.trim() || !courseId) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`${base}/api/ai/chat`, { question: input, courseId }, config);
      const aiMessage = { sender: 'ai', text: data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'ai', text: "Sorry, I couldn't connect. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg z-50"
      >
        {isOpen ? <X size={30} /> : <MessageSquare size={30} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-28 right-6 w-80 h-[450px] bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white text-lg">AI Tutor</h3>
              <p className="text-sm text-gray-300">Ask me anything about your courses!</p>
            </div>

            <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-gray-700 text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-200 rounded-bl-none px-4 py-2 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  placeholder={courseId ? 'Ask a question...' : 'Go to a course page'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={!courseId || isLoading}
                  className="w-full bg-white/10 border-none rounded-lg pl-4 pr-12 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!courseId || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-500"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatDock;
