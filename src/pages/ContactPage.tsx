import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_queries')
        .insert(formData);

      if (error) throw error;

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      question: "How do I register for a tournament?",
      answer: "Click on any active tournament, fill out the registration form with your team details, and complete payment if required. You'll receive a unique registration ID."
    },
    {
      question: "What happens if I can't attend after registering?",
      answer: "Free tournaments allow withdrawals up to 2 hours before start time. Paid tournaments have no refunds unless the tournament is cancelled by us."
    },
    {
      question: "How are winners determined and prizes distributed?",
      answer: "Winners are determined based on our point system. Prizes are distributed within 48 hours via UPI/Bank transfer to verified accounts."
    },
    {
      question: "Can I change my team members after registration?",
      answer: "Team changes are allowed up to 1 hour before tournament start. Contact support with your registration ID and updated team details."
    },
    {
      question: "What if I face technical issues during the tournament?",
      answer: "Contact our support team immediately via WhatsApp. We have technical moderators available during all tournaments."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300">
            Get in touch with our team for support, queries, or partnerships
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-300">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-purple-400 hover:text-purple-300"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-300">support@varsitybgmi.online</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">WhatsApp Support</p>
                    <p className="text-gray-300">+91 90537 39179</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Location</p>
                    <p className="text-gray-300">Gurugram, India</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Response Time</p>
                    <p className="text-gray-300">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-gray-700 pb-4 last:border-b-0"
                  >
                    <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-300 text-sm">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Jitesh Kumar', role: 'Tournament Director', specialty: 'Esports Management' },
              { name: 'Sandeep Kumar', role: 'Community Manager', specialty: 'Player Relations' },
              { name: 'Gulshan Kumar', role: 'Technical Lead', specialty: 'Platform Development' }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-purple-400 font-medium">{member.role}</p>
                <p className="text-gray-400 text-sm mt-2">{member.specialty}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}