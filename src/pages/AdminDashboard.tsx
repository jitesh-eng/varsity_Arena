import  { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AdminSidebar } from '../components/Admin/AdminSidebar';
import { AdminOverview } from '../components/Admin/AdminOverview';
import { AdminTournaments } from '../components/Admin/AdminTournaments';
import { AdminRegistrations } from '../components/Admin/AdminRegistrations';
import { AdminLeaderboard } from '../components/Admin/AdminLeaderboard';
import { AdminQueries } from '../components/Admin/AdminQueries';

export function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <AdminSidebar />
      
      <div className=" w-[75%]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6"
        >
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="tournaments" element={<AdminTournaments />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="leaderboard" element={<AdminLeaderboard />} />
            <Route path="queries" element={<AdminQueries />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </motion.div>
      </div>
    </div>
  );
}