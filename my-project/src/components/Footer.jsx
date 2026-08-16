import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-blue-400">VavSport</span> Hub
            </h3>
            <p className="text-gray-400 mb-4">
              The official sports management platform for Vav University.
              Empowering athletes, connecting students, and celebrating excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/sports" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Sports Teams
                </a>
              </li>
              <li>
                <a href="/matches" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Match Schedules
                </a>
              </li>
              <li>
                <a href="/announcements" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Latest News
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Photo Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>University of Vavuniya Playground, Indoor</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone size={20} className="flex-shrink-0" />
                <span>(+94) 24 222 2264</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail size={20} className="flex-shrink-0" />
                <span>sports@vavuniversity.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} VavSport Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
