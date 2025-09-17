import   { useEffect, useState } from 'react';
 
import { Search, Filter, Check, X, Eye, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Registration {
  id: string;
  tournament_id: string;
  team_name: string;
  leader_name: string;
  game_uid: string;
  whatsapp_number: string;
  payment_status: 'pending' | 'verified' | 'rejected';
  payment_screenshot_url: string | null;
  registration_id: string;
  created_at: string;
  tournament: {
    name: string;
    type: 'free' | 'paid';
  };
}

export function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          tournament:tournaments(name, type)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data as any[] || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ payment_status: status })
        .eq('id', id);

      if (error) throw error;
      fetchRegistrations();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    }
  };

  const viewPaymentScreenshot = (url: string) => {
    if (url) {
      const { data } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(url);
      window.open(data.publicUrl, '_blank');
    }
  };

  const exportToCSV = () => {
    const csvData = filteredRegistrations.map(reg => ({
      'Registration ID': reg.registration_id,
      'Tournament': reg.tournament.name,
      'Team Name': reg.team_name,
      'Leader Name': reg.leader_name,
      'Game UID': reg.game_uid,
      'WhatsApp': reg.whatsapp_number,
      'Payment Status': reg.payment_status,
      'Registration Date': new Date(reg.created_at).toLocaleDateString(),
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.registration_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.leader_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || reg.tournament.type === filterType;
    const matchesStatus = filterStatus === 'all' || reg.payment_status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
        <h1 className="text-3xl font-bold text-white">Registration Management</h1>
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, team, or leader..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Payment Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Registration ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tournament
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Team Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <span className="font-mono text-purple-400">{registration.registration_id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-white">{registration.tournament.name}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        registration.tournament.type === 'free' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {registration.tournament.type.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-white">{registration.team_name}</div>
                      <div className="text-sm text-gray-400">Leader: {registration.leader_name}</div>
                      <div className="text-sm text-gray-400">UID: {registration.game_uid}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{registration.whatsapp_number}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(registration.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration.payment_status === 'verified'
                        ? 'bg-green-900/30 text-green-400'
                        : registration.payment_status === 'rejected'
                        ? 'bg-red-900/30 text-red-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {registration.payment_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {registration.payment_screenshot_url && (
                        <button
                          onClick={() => viewPaymentScreenshot(registration.payment_screenshot_url!)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="View Payment Screenshot"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      
                      {registration.payment_status === 'pending' && (
                        <>
                          <button
                            onClick={() => updatePaymentStatus(registration.id, 'verified')}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Verify Payment"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updatePaymentStatus(registration.id, 'rejected')}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Reject Payment"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Registrations Found</h3>
            <p className="text-gray-500">
              {registrations.length === 0 
                ? 'No registrations yet. They will appear here once teams start registering.'
                : 'Try adjusting your filters to see more results.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}