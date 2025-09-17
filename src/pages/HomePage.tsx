 
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap, Target, Shield, Star } from 'lucide-react';
import img1 from "./1.jpg";
import img2 from "./2.jpg";  
import img333 from "./333.jpg";

import img4 from "./4.jpeg";

const title = "Varsity Arena";

export function HomePage() {

  const letters = title.split("");
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="absolute inset-0  bg-[url('https://wallpapercave.com/wp/wp12811424.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Title */}
        <div className="relative mb-2 flex items-center justify-center text-center">
          <motion.div className="lg:text-9xl md:text-9xl text-[3rem] tracking-tight font-black italic drop-shadow-lg bg-gradient-to-r from-purple-500 via-blue-600 to-[#31c58e] text-transparent bg-clip-text font-orbitron flex flex-wrap justify-center">
            {letters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
        </div>
            <p className="text-sm md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto ">
              Join the ultimate Free Fire tournament platform. Compete with the best, win amazing prizes, and become a legend!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tournaments"
                className="mx-8 md:mx-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-4 md:px-8 md:py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                View Tournaments
              </Link>
              <Link
                to="/about"
                className="mx-20 md:mx-0 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-4 py-2 md:px-8 md:py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Read Rules
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      
      {/* Info Sections */}
      <section className="py-20 px-6 md:px-8 space-y-24 max-w-7xl mx-auto">
        {[
          {
            title: "Join Epic Tournaments",
            desc: "Participate in Daily, Weekly, Monthly and Random days tournaments and competitions. Win prizes, climb rankings, and prove your skills against the best players in the community.",
            img: img1,
            btn: { text: "Browse Tournaments", link: "/#/tournaments" },
          },
          {
            title: "Track Your Progress",
            desc: "Keep an eye on your detailed stats, match history, and overall performance. Follow your journey as you climb the leaderboard, unlock achievements, and showcase your skills to the entire community.",
            img: img2,
            btn: { text: "Leaderboard", link: "/#/tournaments" },
          },
          {
            title: "Win Real Rewards",
            desc: "Compete in tournaments to win exciting cash prizes, unlock exclusive perks, and gain recognition among top players. Your skills don’t just bring victory — they bring real rewards and lasting prestige in the community.",
            img: img333,
            btn: { text: "See Rewards", link: "/#/about" }, 
          },
          {
            title: "Fair Play & Security",
            desc: "Advanced anti-cheat technology, strict monitoring, and transparent rules ensure that every match is safe, fair, and competitive. We are committed to building a trusted platform where skill decides the outcome — not unfair advantages.",
            img: img4,
            btn: { text: "Security Info", link: "/#/about" },
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className={`grid md:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? "md:[&>img]:order-2 md:[&>div]:order-1" : ""
              }`}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src={item.img}
              alt={item.title} 
              className="rounded-2xl shadow-xl border border-gray-800 w-full max-w-full object-cover
             transition-all duration-500 hover:scale-105 
             hover:border-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.7)]"
            />


            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-neon-green font-orbitron">
                {item.title}
              </h2>
              <p className="text-base md:text-lg md:text-xl text-gray-300 mb-6 font-rajdhani">
                {item.desc}
              </p>
              <a href={item.btn.link}>
                <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl font-orbitron">
                  {item.btn.text}
                </button>
              </a>
            </div>
          </motion.div>
        ))}
      </section>


      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Varsity Arena?</h2>
            <p className="text-xl text-gray-300">Experience gaming like never before</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: 'Competitive Tournaments',
                description: 'Join weekly tournaments with exciting cash prizes and rewards.',
                image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
              },
              {
                icon: Users,
                title: 'Active Community',
                description: 'Connect with thousands of active Free Fire players and teams.',
                image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
              },
              {
                icon: Zap,
                title: 'Instant Registration',
                description: 'Quick and easy tournament registration with auto-generated IDs.',
                image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
              },
              {
                icon: Target,
                title: 'Fair Play',
                description: 'Strict anti-cheat measures and fair play policies for all.',
                image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
              },
              {
                icon: Shield,
                title: 'Secure Platform',
                description: 'Your data and payments are protected with enterprise-grade security.',
                image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
              },
              {
                icon: Star,
                title: 'Pro Experience',
                description: 'Professional tournament management and live leaderboards.',
                image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <feature.icon className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'Active Players' },
              { number: '500+', label: 'Tournaments' },
              { number: '₹5L+', label: 'Prizes Won' },
              { number: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Join the Battle?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Register now and compete in our upcoming tournaments!
            </p>
            <Link
              to="/tournaments"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 inline-block"
            >
              Join Tournament
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}