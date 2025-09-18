import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Users, DollarSign, Upload, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import qrcode from './qr.jpg'


type Tournament = Database['public']['Tables']['tournaments']['Row'];

export function TournamentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [showPaymentStep, setShowPaymentStep] = useState(false);

  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    gameUID: '',
    whatsappNumber: '',
    paymentScreenshot: null as File | null,
  });

  useEffect(() => {
    if (id) {
      fetchTournament();
    }
  }, [id]);

  const fetchTournament = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTournament(data);
    } catch (error) {
      console.error('Error fetching tournament:', error);
      navigate('/tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, paymentScreenshot: file }));
    }
  };

  const uploadPaymentScreenshot = async (file: File): Promise<string | null> => {
    try {
      const fileName = `payment-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, file);

      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  // Modify handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournament) return;

    // For paid tournament, move to payment step
    if (tournament.type === 'paid' && !showPaymentStep) {
      setShowPaymentStep(true);
      return;
    }

    setSubmitting(true);

    try {
      let paymentScreenshotUrl = null;

      if (tournament.type === 'paid' && formData.paymentScreenshot) {
        paymentScreenshotUrl = await uploadPaymentScreenshot(formData.paymentScreenshot);
        if (!paymentScreenshotUrl) {
          throw new Error('Failed to upload payment screenshot');
        }
      }

      const { data, error } = await supabase
        .from('registrations')
        .insert({
          tournament_id: tournament.id,
          team_name: formData.teamName,
          leader_name: formData.leaderName,
          game_uid: formData.gameUID,
          whatsapp_number: formData.whatsappNumber,
          payment_screenshot_url: paymentScreenshotUrl,
          payment_status: tournament.type === 'free' ? 'verified' : 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('leaderboard').insert({
        tournament_id: tournament.id,
        registration_id: data.registration_id,
        team_name: formData.teamName,
        leader_name: formData.leaderName,
        points: 0,
        rank: 0,
        status: 'active',
      });

      setRegistrationId(data.registration_id);
      setSuccess(true);
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tournament Not Found</h1>
          <button
            onClick={() => navigate('/tournaments')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-xl p-8 text-center max-w-md mx-4"
        >
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
          <p className="text-gray-300 mb-4">Your registration ID is:</p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <span className="text-2xl font-bold text-purple-400">{registrationId}</span>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            {tournament.type === 'paid'
              ? 'Your registration is pending payment verification. You will receive updates on WhatsApp.'
              : 'Your registration is confirmed. Check the leaderboard for updates.'}
          </p>

          {/* WhatsApp Group Section */}
          <div className="mb-6">
            <p className="text-gray-300 text-sm mb-2">Join our Official WhatsApp Group For all Updates:</p>
            <a
              href="https://chat.whatsapp.com/HpfJTXz0l8V2XTbcdV533B" // <-- yaha apna group link daalna hai
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Join WhatsApp Group
            </a>
          </div>


          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/leaderboard/${tournament.id}`)}
              className="text-xs md:text-base flex-1 bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-lg font-semibold"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => navigate('/tournaments')}
              className="text-xs md:text-base flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 py-5 rounded-lg font-semibold"
            >
              More Tournaments
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 md:py-20">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Tournament Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
            <h1 className="text-xl md:text-4xl font-bold text-white mb-2">{tournament.name}</h1>
            <p className="text-sm md:text-base text-purple-100">{tournament.description}</p>
          </div>

          <div className="p-3 md:p-8">
            {/* Step 1: Tournament Details + Rules + Registration Form */}
            {!(tournament.type === 'paid' && showPaymentStep) && (
              <>
                {/* Tournament Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Tournament Details</h2>
                    <div className="text-sm md:text-base flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-3" />
                      <span>
                        {new Date(tournament.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-sm md:text-xl flex items-center text-gray-300">
                      <Trophy className="h-5 w-5 mr-3" />
                      <span>{tournament.prize}</span>
                    </div>

                    {tournament.type === 'paid' && (
                      <div className="text-sm md:text-xl flex items-center text-gray-300">
                        <DollarSign className="h-5 w-5 mr-3" />
                        <span>Entry Fee: ₹{tournament.entry_fee}</span>
                      </div>
                    )}

                    <div className="text-sm md:text-xl flex items-center text-gray-300">
                      <Users className="h-5 w-5 mr-3" />
                      <span>Max Teams: {tournament.max_teams}</span>
                    </div>
                  </div>

                  {/* 👉 Yaha button add kar diya side me */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => navigate(`/leaderboard/${tournament.id}`)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
                    >
                      Show Leaderboard Details 
                    </button>
                  </div>

                </div>

                <div>
                  <h2 className="text-base md:text-xl font-bold text-white mb-4">Rules</h2>
                  <div className="bg-gray-700 rounded-lg p-2 md:p-4">
                    <p className="text-xs md:text-base text-gray-300 whitespace-pre-line">{tournament.rules}</p>
                  </div>
                </div>
                {/* Registration Form */}
                <div className="border-t border-gray-700 pt-8">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Registration Form</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Team Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Team Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.teamName}
                          onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your team name"
                        />
                      </div>

                      {/* Leader Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Team Leader In-game Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.leaderName}
                          onChange={(e) => setFormData(prev => ({ ...prev, leaderName: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter leader's in-game name"
                        />
                      </div>

                      {/* Game UID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Game UID *</label>
                        <input
                          type="text"
                          required
                          value={formData.gameUID}
                          onChange={(e) => setFormData(prev => ({ ...prev, gameUID: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your Free Fire UID"
                        />
                      </div>

                      {/* WhatsApp Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter WhatsApp number"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 rounded-lg font-semibold text-lg transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      {tournament.type === 'paid' ? 'Proceed to Payment' : 'Register for Tournament'}
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* Step 2: Payment Information */}
            {tournament.type === 'paid' && showPaymentStep && (
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">UPI ID</p>
                    <p className="font-semibold text-white">8797505958@ibl</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Account Holder</p>
                    <p className="font-semibold text-white">Rishi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="font-semibold text-purple-400">₹{tournament.entry_fee}</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center mb-6">
                  <p className="text-sm text-gray-400 mb-2">Scan QR to Pay</p>
                  <div className="bg-white p-3 rounded-lg">
                    <img
                      src={qrcode}
                      alt="QR_CODE"
                      className="w-32 h-32 md:w-40 md:h-40 object-contain"
                    />
                  </div>
                </div>

                {/* Payment Screenshot Upload */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Upload Payment Screenshot *</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-400">
                            {formData.paymentScreenshot
                              ? formData.paymentScreenshot.name
                              : 'Click to upload screenshot'}
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 rounded-lg font-semibold text-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Registering...' : 'Confirm Payment & Register'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

}