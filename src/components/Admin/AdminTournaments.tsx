import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Trophy, Users, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type Tournament = Database['public']['Tables']['tournaments']['Row'];

export function AdminTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'free' as 'free' | 'paid',
    date: '',
    prize: '',
    entry_fee: 0,
    rules: '',
    description: '',
    max_teams: 100,
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTournament) {
        const { error } = await supabase
          .from('tournaments')
          .update(formData)
          .eq('id', editingTournament.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tournaments')
          .insert(formData);

        if (error) throw error;
      }

      setFormData({
        name: '',
        type: 'free',
        date: '',
        prize: '',
        entry_fee: 0,
        rules: '',
        description: '',
        max_teams: 100,
      });
      setShowCreateForm(false);
      setEditingTournament(null);
      fetchTournaments();
    } catch (error) {
      console.error('Error saving tournament:', error);
      alert('Failed to save tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setFormData({
      name: tournament.name,
      type: tournament.type,
      date: new Date(tournament.date).toISOString().slice(0, 16),
      prize: tournament.prize,
      entry_fee: tournament.entry_fee,
      rules: tournament.rules,
      description: tournament.description,
      max_teams: tournament.max_teams,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;

    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTournaments();
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Failed to delete tournament');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchTournaments();
    } catch (error) {
      console.error('Error updating tournament status:', error);
    }
  };

  if (loading && tournaments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Tournament Management</h1>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingTournament(null);
            setFormData({
              name: '',
              type: 'free',
              date: '',
              prize: '',
              entry_fee: 0,
              rules: '',
              description: '',
              max_teams: 100,
            });
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Tournament</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">
            {editingTournament ? 'Edit Tournament' : 'Create New Tournament'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tournament Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter tournament name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tournament Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'free' | 'paid' }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tournament Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prize *
                </label>
                <input
                  type="text"
                  required
                  value={formData.prize}
                  onChange={(e) => setFormData(prev => ({ ...prev, prize: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., ₹5000 Cash Prize"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Entry Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.entry_fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, entry_fee: Number(e.target.value) }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0 for free tournaments"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Teams
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_teams}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_teams: Number(e.target.value) }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Brief description of the tournament"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rules *
              </label>
              <textarea
                required
                rows={4}
                value={formData.rules}
                onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tournament rules and regulations"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Saving...' : (editingTournament ? 'Update Tournament' : 'Create Tournament')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingTournament(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tournaments List */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tournament
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Prize
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
              {tournaments.map((tournament) => (
                <tr key={tournament.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-white">{tournament.name}</div>
                      <div className="text-sm text-gray-400">{tournament.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tournament.type === 'free' 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {tournament.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">
                      {new Date(tournament.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(tournament.date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{tournament.prize}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(tournament.id, tournament.is_active)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tournament.is_active
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      {tournament.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/tournament/${tournament.id}`, '_blank')}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Tournament"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(tournament)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        title="Edit Tournament"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tournament.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Tournament"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Tournaments Yet</h3>
            <p className="text-gray-500">Create your first tournament to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}