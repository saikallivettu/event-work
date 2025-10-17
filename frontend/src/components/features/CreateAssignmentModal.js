import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import axios from 'axios';

const CreateAssignmentModal = ({ isOpen, onClose, courseId, onAssignmentCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const newAssignment = { title, description, dueDate, courseId };
            const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
            const { data } = await axios.post(`${base}/api/assignments`, newAssignment, config);
            onAssignmentCreated?.(data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create assignment.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="w-full max-w-lg bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                    <h2 className="text-2xl font-bold text-white mb-6">Create New Assignment</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300">Description</label>
                            <textarea
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:scale-105 transform transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateAssignmentModal;
