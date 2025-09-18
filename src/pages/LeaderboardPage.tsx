import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  id: string;
  registration_id: string;
  team_name: string;
  leader_name: string;
  points: number;
  rank: number;
  status: 'active' | 'eliminated' | 'disqualified';
  created_at: string;
  tournament: {
    name: string;
    type: 'free' | 'paid';
  };
  registration: {
    payment_status: 'pending' | 'verified' | 'rejected';
  };
}

export function LeaderboardPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tournamentName, setTournamentName] = useState('');

  useEffect(() => {
    if (tournamentId) {
      fetchLeaderboard();
    }
  }, [tournamentId]);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          tournament:tournaments(name, type),
          registration:registrations(payment_status)
        `)
        .eq('tournament_id', tournamentId)
        .order('rank', { ascending: true })
        .order('points', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const leaderboardData = data as any[];
      setLeaderboard(leaderboardData);

      if (leaderboardData.length > 0) {
        setTournamentName(leaderboardData[0].tournament.name);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter(
    entry =>
      entry.registration_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.leader_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900/30';
      case 'eliminated':
        return 'text-red-400 bg-red-900/30';
      case 'disqualified':
        return 'text-gray-400 bg-gray-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-300">{tournamentName}</p>
          <Link
            to="/tournaments"
            className="inline-block mt-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Tournaments
          </Link>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by Registration ID, Team, or Leader..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[0.65rem] md:text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[0.65rem] md:text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Reg. ID
                  </th>
                  <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[0.65rem] md:text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[0.65rem] md:text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Leader
                  </th>
                  <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[0.65rem] md:text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[0.65rem] md:text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  {leaderboard.some(entry => entry.tournament.type === 'paid') && (
                    <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[0.65rem] md:text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLeaderboard.map((entry, index) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700/50 transition-colors text-xs md:text-sm"
                  >
                    <td className="px-2 md:px-6 py-2 md:py-4 whitespace-normal break-words">
                      {entry.rank > 0 ? getRankIcon(entry.rank) : <span className="text-[0.65rem] text-gray-500">-</span>}
                    </td>
                    <td className="px-2 md:px-6 py-2 md:py-4 whitespace-normal break-words">
                      <span className="font-mono text-[0.65rem] md:text-sm text-purple-400">{entry.registration_id}</span>
                    </td>
                    <td className="px-2 md:px-6 py-2 md:py-4 whitespace-normal break-words">
                      <span className="font-semibold text-white text-[0.5rem] md:text-sm">{entry.team_name}</span>
                    </td>
                    <td className="px-2 md:px-6 py-2 md:py-4 whitespace-normal break-words">
                      <span className="text-gray-300 text-xs md:text-sm">{entry.leader_name}</span>
                    </td>
                    <td className="px-2 md:px-6 py-2 md:py-4 whitespace-normal break-words">
                      <span className="text-sm md:text-lg font-bold text-purple-400">{entry.points}</span>
                    </td>
                    <td className="px-2 md:px-6 py-2 md:py-4 whitespace-normal break-words">
                      <span className={`px-2 py-1 rounded-full text-[0.65rem] md:text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {entry.status.toUpperCase()}
                      </span>
                    </td>
                    {leaderboard.some(entry => entry.tournament.type === 'paid') && (
                      <td className="px-2 md:px-6 py-2 md:py-4 whitespace-normal break-words">
                        <span className={`px-2 py-1 rounded-full text-[0.65rem] md:text-xs font-medium ${entry.registration.payment_status === 'verified'
                            ? 'text-green-400 bg-green-900/30'
                            : entry.registration.payment_status === 'rejected'
                              ? 'text-red-400 bg-red-900/30'
                              : 'text-yellow-400 bg-yellow-900/30'
                          }`}>
                          {entry.registration.payment_status.toUpperCase()}
                        </span>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>

            </table>
          </div>

          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-24 w-24 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                {searchTerm ? 'No results found' : 'No registrations yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Teams will appear here once they register for the tournament'
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}