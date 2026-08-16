import { Trophy, Activity, Calendar, Star, MapPin, Clock } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useMatches } from "../context/MatchesContext";
import { useAnnouncements } from "../context/AnnouncementContext";
import { useAuth } from "../context/AuthContext";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const PlayerStats = () => {
    const { matches, loading } = useMatches();
    const { announcements } = useAnnouncements();
    const { user } = useAuth();

    // ── Compute real stats from match data ──────────────────────────
    const allMatches   = matches.filter(m => (m.type || "Match") === "Match");
    const completedMatches = allMatches.filter(m => m.status === "Completed");
    const upcomingMatches  = allMatches.filter(m => m.status === "Upcoming");

    const totalPlayed  = completedMatches.length;
    const totalWins    = completedMatches.filter(m => m.winner && m.winner.trim() !== "").length;
    const totalUpcoming = upcomingMatches.length;

    // Sport breakdown — how many completed matches per sport
    const sportCounts = completedMatches.reduce((acc, m) => {
        const sport = m.sportName || m.sport || "Other";
        acc[sport] = (acc[sport] || 0) + 1;
        return acc;
    }, {});
    const sportChartData = Object.entries(sportCounts).map(([name, value]) => ({ name, value }));

    // Recent matches for the bar chart (last 5 completed)
    const recentMatchData = completedMatches.slice(-5).map((m, i) => ({
        name: m.sportName || m.sport || `Match ${i + 1}`,
        team1: m.team1 || "Team A",
        team2: m.team2 || "Team B",
        score: m.score || "—",
        winner: m.winner || "—",
        venue: m.venue || "—",
        date: m.date || "—",
        // For bar chart height — just use 100 for wins, 60 for no-winner (draw)
        result: m.winner ? 100 : 60,
    }));

    // Upcoming matches list
    const upcomingList = upcomingMatches.slice(0, 4);

    // Recent announcements
    const recentAnnouncements = [...announcements].slice(0, 3);

    const stats = [
        {
            icon: <Activity className="text-blue-500" size={24} />,
            label: "Matches Played",
            value: totalPlayed,
            bg: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            icon: <Trophy className="text-yellow-500" size={24} />,
            label: "Wins Recorded",
            value: totalWins,
            bg: "bg-yellow-50 dark:bg-yellow-900/20"
        },
        {
            icon: <Calendar className="text-green-500" size={24} />,
            label: "Upcoming Matches",
            value: totalUpcoming,
            bg: "bg-green-50 dark:bg-green-900/20"
        },
        {
            icon: <Star className="text-purple-500" size={24} />,
            label: "Announcements",
            value: announcements.length,
            bg: "bg-purple-50 dark:bg-purple-900/20"
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Player Statistics</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Live data from {totalPlayed} completed matches · {totalUpcoming} upcoming
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${stat.bg} rounded-lg`}>
                                {stat.icon}
                            </div>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* ── Recent Match Results Bar Chart ── */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Recent Match Results
                        <span className="ml-2 text-sm font-normal text-gray-500">(last {recentMatchData.length} completed)</span>
                    </h2>
                    {recentMatchData.length > 0 ? (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={recentMatchData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 120]} hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                                        formatter={(value, name, props) => [
                                            `Score: ${props.payload.score}`,
                                            `${props.payload.team1} vs ${props.payload.team2}`
                                        ]}
                                        labelFormatter={(label) => `Sport: ${label}`}
                                    />
                                    <Bar dataKey="result" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            No completed matches yet
                        </div>
                    )}
                </div>

                {/* ── Sport Breakdown Pie Chart ── */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sport Breakdown</h2>
                    {sportChartData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={sportChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name }) => name}>
                                        {sportChartData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            No data yet
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ── Recent Completed Matches ── */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Completed Matches</h2>
                    {completedMatches.length > 0 ? (
                        <div className="space-y-3">
                            {completedMatches.slice(-5).reverse().map((m, i) => (
                                <div key={m.id || i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                            {m.team1} <span className="text-gray-400 font-normal mx-1">vs</span> {m.team2}
                                        </p>
                                        <p className="text-xs text-blue-500">{m.sportName || m.sport}</p>
                                        <div className="flex items-center text-xs text-gray-400 mt-0.5 gap-2">
                                            <span className="flex items-center gap-1"><Calendar size={10} /> {m.date}</span>
                                            <span className="flex items-center gap-1"><MapPin size={10} /> {m.venue}</span>
                                        </div>
                                    </div>
                                    <div className="text-right ml-3 flex-shrink-0">
                                        {m.score && (
                                            <p className="text-base font-bold text-blue-600 dark:text-blue-400">{m.score}</p>
                                        )}
                                        {m.winner ? (
                                            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">🏆 {m.winner}</p>
                                        ) : (
                                            <p className="text-xs text-gray-400">🤝 Draw</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No completed matches yet</p>
                    )}
                </div>

                {/* ── Upcoming Matches ── */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Matches</h2>
                    {upcomingList.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingList.map((m, i) => (
                                <div key={m.id || i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-green-500">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                            {m.team1} <span className="text-gray-400 font-normal mx-1">vs</span> {m.team2}
                                        </p>
                                        <p className="text-xs text-blue-500">{m.sportName || m.sport}</p>
                                        <div className="flex items-center text-xs text-gray-400 mt-0.5 gap-2">
                                            <span className="flex items-center gap-1"><Calendar size={10} /> {m.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={10} /> {m.time}</span>
                                        </div>
                                    </div>
                                    <div className="text-right ml-3 flex-shrink-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{m.venue}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                                            Upcoming
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No upcoming matches</p>
                    )}

                    {/* Recent Announcements */}
                    {recentAnnouncements.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Latest Announcements</h3>
                            <div className="space-y-2">
                                {recentAnnouncements.map((a, i) => (
                                    <div key={a.id || i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{a.date} · {a.author}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerStats;
