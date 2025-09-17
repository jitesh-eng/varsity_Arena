
import { motion } from 'framer-motion';
import { Clock, Calendar, Zap } from 'lucide-react';

export function TDMPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-8"
          >
            <Zap className="h-24 w-24 text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
            Clash Squad Mode
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Coming Soon
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get ready for intense Clash Squad battles! Fast-paced action, quick matches, and non-stop excitement awaits.
          </p>
          
          <div className="bg-gray-800 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-purple-400" />
              <span className="text-2xl font-bold text-white">December 2025</span>
            </div>
            <p className="text-gray-400">
              Clash Squad tournaments will be launching with exclusive prizes and leaderboards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Quick Matches</h3>
              <p className="text-gray-400">Fast 10-minute battles for instant action</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <Zap className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Skill-Based</h3>
              <p className="text-gray-400">Ranked system with skill-based matchmaking</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <span className="text-white font-bold">₹</span>
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-2">Daily Rewards</h3>
              <p className="text-gray-400">Win daily cash prizes and exclusive rewards</p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30"
          >
            <h3 className="text-xl font-semibold text-white mb-2">Stay Notified</h3>
            <p className="text-gray-300 mb-4">
              Be the first to know when Clash Squad mode launches with exclusive early access rewards!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200">
                Notify Me
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}