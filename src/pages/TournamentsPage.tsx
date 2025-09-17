import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Trophy,Map, Users, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import img1 from './1.jpg'
import img2 from './2.jpg'

type Tournament = Database['public']['Tables']['tournaments']['Row'];

export function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
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
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Active Tournaments
          </h1>
          <p className="text-xl text-gray-300">Choose your battle and dominate the arena!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="h-48 bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center">

                {tournament.type === 'paid' && (
                  <img
                    src={img1}
                    alt="Trophy"
                  />
                )}

                {tournament.type === 'free' && (
                  <img
                    src={img2}
                    alt="Trophy"
                  />
                )}

                 
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${tournament.type === 'free'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {tournament.type === 'free' ? 'FREE' : 'PAID'}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{tournament.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {new Date(tournament.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span className="text-sm">{tournament.prize}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Map className="h-4 w-4 mr-2" />
                    <span className="text-sm">Maps : Bermuda and Purgatory</span>
                  </div>

                  {tournament.type === 'paid' && (
                    <div className="flex items-center text-gray-300">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">Entry Fee: ₹{tournament.entry_fee} per squad</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-300">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">Max Teams: {tournament.max_teams}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link
                    to={`/tournament/${tournament.id}`}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    Register
                  </Link>
                  <Link
                    to={`/leaderboard/${tournament.id}`}
                    className="flex-1 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white text-center py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    Leaderboard
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {tournaments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Trophy className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Active Tournaments</h3>
            <p className="text-gray-500">Check back soon for upcoming tournaments!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}