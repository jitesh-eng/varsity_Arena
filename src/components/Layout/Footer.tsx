 
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Varsity Arena
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              The ultimate destination for Free Fire tournaments and esports competitions.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/#/tournaments" className="block text-gray-400 hover:text-purple-400 transition-colors">
                Tournaments
              </Link>
              <Link to="/#/about" className="block text-gray-400 hover:text-purple-400 transition-colors">
                About Us
              </Link>
              <Link to="/#/contact" className="block text-gray-400 hover:text-purple-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <a href="/#/about" className="block text-gray-400 hover:text-purple-400 transition-colors">
                Tournament Rules
              </a>
              <a href="/#/contact" className="block text-gray-400 hover:text-purple-400 transition-colors">
                FAQ
              </a>
              <a href="/#/about" className="block text-gray-400 hover:text-purple-400 transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@varsitybgmi.online</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 90537 39179</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Gurugram, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Varsity Arena. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}