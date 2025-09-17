import   { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Edit, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LeaderboardEntry {
  id: string;
  tournament_id: string;
  registration_id: string;
  team_name: string;
  leader_name: string;
  points: number;
  rank: number;
  status: 'active' | 'eliminated' | 'disqualified';
  tournament: {
    name: string;
  };
}

export function AdminLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    points: 0,
    rank: 0,
    status: 'active' as 'active' | 'eliminated' | 'disqualified'
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchLeaderboard();
    }
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('id, name')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
      
      if (data && data.length > 0) {
        setSelectedTournament(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          tournament:tournaments(name)
        `)
        .eq('tournament_id', selectedTournament)
        .order('rank', { ascending: true })
        .order('points', { ascending: false });

      if (error) throw error;
      setEntries(data as any[] || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const startEdit = (entry: LeaderboardEntry) => {
    setEditingEntry(entry.id);
    setEditForm({
      points: entry.points,
      rank: entry.rank,
      status: entry.status
    });
  };

  const saveEdit = async () => {
    if (!editingEntry) return;

    try {
      const { error } = await supabase
        .from('leaderboard')
        .update(editForm)
        .eq('id', editingEntry);

      if (error) throw error;
      
      setEditingEntry(null);
      fetchLeaderboard();
    } catch (error) {
      console.error('Error updating leaderboard entry:', error);
      alert('Failed to update entry');
    }
  };

  const cancelEdit = () => {
    setEditingEntry(null);
  };

  const autoRank = async () => {
    if (!selectedTournament) return;

    try {
      // Get all entries sorted by points
      const { data: entriesData, error } = await supabase
        .from('leaderboard')
        .select('id, points')
        .eq('tournament_id', selectedTournament)
        .order('points', { ascending: false });

      if (error) throw error;

      // Update ranks based on points
      const updates = entriesData?.map((entry, index) => ({
        id: entry.id,
        rank: index + 1
      })) || [];

      for (const update of updates) {
        await supabase
          .from('leaderboard')
          .update({ rank: update.rank })
          .eq('id', update.id);
      }

      fetchLeaderboard();
    } catch (error) {
      console.error('Error auto-ranking:', error);
      alert('Failed to auto-rank entries');
    }
  };

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
        <h1 className="text-3xl font-bold text-white">Leaderboard Management</h1>
        <button
          onClick={autoRank}
          disabled={!selectedTournament}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Auto-Rank by Points
        </button>
      </div>

      {/* Tournament Selection */}
      <div className="bg-gray-800 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Tournament
        </label>
        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select a tournament...</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTournament && (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Leader
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      {editingEntry === entry.id ? (
                        <input
                          type="number"
                          min="0"
                          value={editForm.rank}
                          onChange={(e) => setEditForm(prev => ({ ...prev, rank: Number(e.target.value) }))}
                          className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:ring-1 focus:ring-purple-500"
                        />
                      ) : (
                        <div className="flex items-center">
                          {entry.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500 mr-2" />}
                          <span className={`font-bold ${entry.rank <= 3 ? 'text-yellow-400' : 'text-gray-300'}`}>
                            #{entry.rank || '-'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">{entry.team_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{entry.leader_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      {editingEntry === entry.id ? (
                        <input
                          type="number"
                          min="0"
                          value={editForm.points}
                          onChange={(e) => setEditForm(prev => ({ ...prev, points: Number(e.target.value) }))}
                          className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:ring-1 focus:ring-purple-500"
                        />
                      ) : (
                        <span className="font-bold text-purple-400">{entry.points}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingEntry === entry.id ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="active">Active</option>
                          <option value="eliminated">Eliminated</option>
                          <option value="disqualified">Disqualified</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'active'
                            ? 'bg-green-900/30 text-green-400'
                            : entry.status === 'eliminated'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-gray-900/30 text-gray-400'
                        }`}>
                          {entry.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingEntry === entry.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={saveEdit}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Save Changes"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Cancel Edit"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(entry)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                          title="Edit Entry"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {entries.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-24 w-24 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Entries Found</h3>
              <p className="text-gray-500">
                Leaderboard entries will appear here once teams register for the selected tournament.
              </p>
            </div>
          )}
        </div>
      )}

      {!selectedTournament && tournaments.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-24 w-24 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Active Tournaments</h3>
          <p className="text-gray-500">Create a tournament first to manage its leaderboard.</p>
        </div>
      )}
    </div>
  );
}