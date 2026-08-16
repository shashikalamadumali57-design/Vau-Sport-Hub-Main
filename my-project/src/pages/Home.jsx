import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Trophy, Users } from "lucide-react";
import { sports, matches, announcements } from "../data/mockData";

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/home-bg.jpg')", filter: "grayscale(50%)" }}
        ></div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Welcome to VavSport Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            The heart of university sports excellence. Manage teams, track scores, and stay connected.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Join Now
            </Link>
            <Link
              to="/matches"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all"
            >
              View Matches
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <Trophy size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Sports Management</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive management for all university sports teams, from basketball to swimming.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Event Scheduling</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Keep track of upcoming matches, practice sessions, and special sports events.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Community Hub</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with coaches, athletes, and fellow students in one central platform.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Sports */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Sports</h2>
              <p className="text-gray-600 dark:text-gray-400">Discover the teams representing our university</p>
            </div>
            <Link to="/sports" className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.slice(0, 4).map((sport) => (
              <Link key={sport.id} to="/sports" className="group relative overflow-hidden rounded-xl shadow-lg aspect-[3/4]">
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{sport.name}</h3>
                  <p className="text-gray-300 text-sm">{sport.coach}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upcoming Matches */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Matches</h2>
              <Link to="/matches" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">See All</Link>
            </div>
            <div className="space-y-4">
              {matches.slice(0, 3).map((match) => (
                <div key={match.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{match.sport} • {match.date}</p>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      {match.team1} <span className="text-gray-400 text-sm font-normal mx-1">vs</span> {match.team2}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center">
                      <MapPinIcon className="w-3 h-3 mr-1" /> {match.venue}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-full">
                      {match.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notice Board</h2>
              <Link to="/announcements" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">See All</Link>
            </div>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">{item.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper icon component for this file
const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default Home;
