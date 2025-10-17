import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import AnimatedBackground from './components/common/AnimatedBackground';
import Sidebar from './components/common/Sidebar';
import CourseDetailsPage from './pages/CourseDetailsPage';
import Loader from './components/common/Loader';
import LandingPage from './pages/LandingPage';
import SummarizerPage from './pages/SummarizerPage';

// Placeholder pages/components until created
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader text="Initializing Session..." />;
  }

  return (
    <Router>
      <AnimatedBackground />
      <div className="flex min-h-screen">
        {user && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${user ? 'ml-20 md:ml-64' : ''}`}>
          <React.Suspense fallback={<div className="text-white p-6">Loading...</div>}>
            <Routes>
              <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
              <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
              <Route path="/courses/:id" element={user ? <CourseDetailsPage /> : <Navigate to="/auth" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
              <Route path="/assignments/:assignmentId/submissions" element={user ? <SubmissionsPage /> : <Navigate to="/auth" />} />
              <Route path="/my-grades" element={user ? <MyGradesPage /> : <Navigate to="/auth" />} />
              <Route path="/summarizer" element={user ? <SummarizerPage /> : <Navigate to="/auth" />} />
              <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} />} />
            </Routes>
          </React.Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
