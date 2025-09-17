import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  totalTournaments: number;
  totalRegistrations: number;
  totalRevenue: number;
  pendingQueries: number;
  activeParticipants: number;
  verificationsPending: number;
}

export function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalTournaments: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    pendingQueries: 0,
    activeParticipants: 0,
    verificationsPending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch tournaments count
      const { count: tournamentsCount } = await supabase
        .from('tournaments')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch registrations count
      const { count: registrationsCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });

      // Fetch revenue from paid tournaments
      const { data: paidRegistrations } = await supabase
        .from('registrations')
        .select('tournament_id, tournaments(entry_fee)')
        .eq('payment_status', 'verified')
        .not('tournaments', 'is', null);

      let totalRevenue = 0;
      if (paidRegistrations) {
        totalRevenue = paidRegistrations.reduce((sum, reg) => {
          const tournament = reg.tournaments as any;
          return sum + (tournament?.entry_fee || 0);
        }, 0);
      }

      // Fetch pending queries
      const { count: pendingQueriesCount } = await supabase
        .from('contact_queries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      // Fetch active participants (unique teams)
      const { data: activeParticipants } = await supabase
        .from('leaderboard')
        .select('team_name')
        .eq('status', 'active');

      // Fetch pending verifications
      const { count: pendingVerificationsCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'pending');

      setStats({
        totalTournaments: tournamentsCount || 0,
        totalRegistrations: registrationsCount || 0,
        totalRevenue: totalRevenue,
        pendingQueries: pendingQueriesCount || 0,
        activeParticipants: activeParticipants?.length || 0,
        verificationsPending: pendingVerificationsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Active Tournaments',
      value: stats.totalTournaments,
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
      change: '+2 this week'
    },
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+15 today'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: '+₹2,500 this month'
    },
    {
      title: 'Active Participants',
      value: stats.activeParticipants,
      icon: TrendingUp,
      color: 'from-yellow-500 to-yellow-600',
      change: 'Live tournaments'
    },
    {
      title: 'Pending Queries',
      value: stats.pendingQueries,
      icon: MessageSquare,
      color: 'from-red-500 to-red-600',
      change: 'Needs attention'
    },
    {
      title: 'Pending Verifications',
      value: stats.verificationsPending,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      change: 'Payment pending'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <button
          onClick={fetchStats}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Create Tournament', href: '/admin/tournaments', color: 'bg-purple-600 hover:bg-purple-700' },
            { title: 'View Registrations', href: '/admin/registrations', color: 'bg-blue-600 hover:bg-blue-700' },
            { title: 'Update Leaderboard', href: '/admin/leaderboard', color: 'bg-green-600 hover:bg-green-700' },
            { title: 'Answer Queries', href: '/admin/queries', color: 'bg-red-600 hover:bg-red-700' },
          ].map((action) => (
            <a
              key={action.title}
              href={action.href}
              className={`${action.color} text-white text-center py-3 px-4 rounded-lg font-medium transition-colors`}
            >
              {action.title}
            </a>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-full">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">New team registration</p>
                <p className="text-gray-400 text-sm">Team "Thunder Bolts" registered for Championship</p>
              </div>
            </div>
            <span className="text-gray-400 text-sm">2 mins ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-full">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Payment verified</p>
                <p className="text-gray-400 text-sm">Payment for Team "Fire Squad" approved</p>
              </div>
            </div>
            <span className="text-gray-400 text-sm">15 mins ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-full">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Tournament completed</p>
                <p className="text-gray-400 text-sm">Free Fire Championship results updated</p>
              </div>
            </div>
            <span className="text-gray-400 text-sm">1 hour ago</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}