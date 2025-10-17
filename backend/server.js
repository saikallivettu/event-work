const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

// Initialize App
const app = express();
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000'
  ],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Create HTTP and Socket.IO servers
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Your React app's URL
    methods: ['GET', 'POST']
  }
});

// API Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
// ... add other routes later

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a specific course forum room
  socket.on('join_forum', (courseId) => {
    try {
      socket.join(courseId);
      console.log(`User ${socket.id} joined forum for course ${courseId}`);
    } catch (e) {
      console.error('join_forum error:', e);
    }
  });

  // Listen for a new message and broadcast to the course room
  socket.on('send_message', (data) => {
    try {
      // data = { courseId, text, user, timestamp }
      // Optionally persist to DB here
      if (data?.courseId) {
        io.to(data.courseId).emit('receive_message', data);
      }
    } catch (e) {
      console.error('send_message error:', e);
    }
  });

  // Leave a course forum room
  socket.on('leave_forum', (courseId) => {
    try {
      socket.leave(courseId);
      console.log(`User ${socket.id} left forum for course ${courseId}`);
    } catch (e) {
      console.error('leave_forum error:', e);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // More socket logic will go here (e.g., for forums, notifications)
});

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Make io accessible in other files if needed (e.g., controllers for notifications)
app.set('socketio', io);
