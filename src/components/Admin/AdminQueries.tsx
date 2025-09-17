import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Check, Eye, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'unread' | 'read' | 'responded';
  admin_notes: string | null;
  created_at: string;
}

export function AdminQueries() {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'responded'>('all');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQueries(data || []);
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQueryStatus = async (id: string, status: 'read' | 'responded', notes?: string) => {
    try {
      const updateData: any = { status };
      if (notes !== undefined) {
        updateData.admin_notes = notes;
      }

      const { error } = await supabase
        .from('contact_queries')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      fetchQueries();
      
      if (selectedQuery?.id === id) {
        setSelectedQuery(prev => prev ? { ...prev, status, admin_notes: notes || prev.admin_notes } : null);
      }
    } catch (error) {
      console.error('Error updating query status:', error);
      alert('Failed to update query status');
    }
  };

  const openQueryModal = (query: ContactQuery) => {
    setSelectedQuery(query);
    setAdminNotes(query.admin_notes || '');
    
    // Mark as read if it's unread
    if (query.status === 'unread') {
      updateQueryStatus(query.id, 'read');
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedQuery) return;

    await updateQueryStatus(selectedQuery.id, 'responded', adminNotes);
    setSelectedQuery(null);
  };

  const filteredQueries = queries.filter(query => 
    filterStatus === 'all' || query.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-900/30 text-red-400';
      case 'read':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'responded':
        return 'bg-green-900/30 text-green-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
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
        <h1 className="text-3xl font-bold text-white">Contact Queries</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      {/* Queries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQueries.map((query, index) => (
          <motion.div
            key={query.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => openQueryModal(query)}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-white truncate">{query.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                {query.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm truncate">{query.email}</span>
              </div>
              
              {query.phone && (
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{query.phone}</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-400 text-sm line-clamp-3 mb-4">
              {query.message}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(query.created_at).toLocaleDateString()}
              </span>
              <Eye className="h-4 w-4 text-purple-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {filteredQueries.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-24 w-24 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            {filterStatus === 'all' ? 'No Queries Yet' : `No ${filterStatus} queries`}
          </h3>
          <p className="text-gray-500">
            {filterStatus === 'all' 
              ? 'Contact queries will appear here when users submit them.'
              : `Try changing the filter to see other queries.`
            }
          </p>
        </div>
      )}

      {/* Query Detail Modal */}
      {selectedQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedQuery(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedQuery.name}</h2>
                <div className="space-y-1">
                  <div className="flex items-center text-gray-300">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{selectedQuery.email}</span>
                  </div>
                  {selectedQuery.phone && (
                    <div className="flex items-center text-gray-300">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{selectedQuery.phone}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-400">
                    {new Date(selectedQuery.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedQuery.status)}`}>
                {selectedQuery.status.toUpperCase()}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Message</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">{selectedQuery.message}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Admin Notes</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add your response or notes here..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={saveAdminNotes}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Save & Mark Responded</span>
              </button>
              <button
                onClick={() => setSelectedQuery(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}