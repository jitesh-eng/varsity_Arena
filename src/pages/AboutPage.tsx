 
import { motion } from 'framer-motion';
import { Shield, Trophy, Users, Zap, Target, Award } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            About Varsity Arena
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The premier destination for competitive Free Fire gaming in India
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Varsity Arena was created to provide a professional, fair, and exciting platform for Free Fire enthusiasts 
              to compete, connect, and showcase their skills. We believe in fostering a community where every player, 
              from casual gamers to aspiring pros, can find their place in the competitive gaming ecosystem.
            </p>
          </div>
        </motion.section>

        {/* Features */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Why Choose Us?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Fair Play Guarantee',
                description: 'Advanced anti-cheat systems and strict fair play policies ensure a level playing field for all participants.'
              },
              {
                icon: Trophy,
                title: 'Exciting Prizes',
                description: 'Regular tournaments with attractive cash prizes, gaming gear, and exclusive rewards for winners.'
              },
              {
                icon: Users,
                title: 'Growing Community',
                description: 'Join thousands of passionate Free Fire players in our ever-growing competitive gaming community.'
              },
              {
                icon: Zap,
                title: 'Instant Registration',
                description: 'Quick and easy tournament registration with auto-generated IDs and seamless payment processing.'
              },
              {
                icon: Target,
                title: 'Skill-Based Matching',
                description: 'Tournaments designed for different skill levels, from beginners to professional esports teams.'
              },
              {
                icon: Award,
                title: 'Professional Management',
                description: 'Expert tournament organization with live updates, real-time leaderboards, and professional support.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
                <feature.icon className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tournament Rules */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Tournament Rules & Guidelines</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">General Rules</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>All participants must use their registered in-game names</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Use of hacks, cheats, or exploits results in immediate disqualification</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Teams must have a minimum of 2 and maximum of 4 players</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Registration closes 30 minutes before tournament start time</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>All matches are played on Bermuda map unless specified</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Point System</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span>Booyah (1st Place)</span>
                  <span className="text-yellow-400 font-bold">+12 Points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span>2nd Place</span>
                  <span className="text-green-400 font-bold">+8 Points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span>3rd Place</span>
                  <span className="text-blue-400 font-bold">+6 Points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span>4th Place</span>
                  <span className="text-blue-400 font-bold">+4 Points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span>Each Kill</span>
                  <span className="text-purple-400 font-bold">+1 Point</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Terms & Conditions */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Terms & Conditions</h2>
          
          <div className="prose prose-gray max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Registration & Payment</h4>
                <ul className="space-y-2 text-sm">
                  <li>• All registrations are final once payment is verified</li>
                  <li>• Refunds are only available if tournament is cancelled</li>
                  <li>• Payment must be completed within 24 hours of registration</li>
                  <li>• Teams with pending payments may be removed</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Fair Play Policy</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Zero tolerance for cheating or hacking</li>
                  <li>• Account sharing during tournaments is prohibited</li>
                  <li>• Teaming with other squads results in disqualification</li>
                  <li>• All decisions by tournament admins are final</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Prize Distribution</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Prizes are distributed within 48 hours of tournament end</li>
                  <li>• Winners must provide valid payment details</li>
                  <li>• Tax deductions apply as per Indian laws</li>
                  <li>• Disputes must be raised within 24 hours</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Code of Conduct</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Respectful behavior towards all participants</li>
                  <li>• No abusive language or harassment</li>
                  <li>• Follow all tournament schedules and timings</li>
                  <li>• Report any suspicious activity to admins</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}