import { useState, useEffect } from "react";
import { useMatches } from "../context/MatchesContext";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { Calendar, Clock, MapPin, Trash2, Plus, Edit } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const Matches = () => {
  const { matches, loading, error, addMatch, deleteMatch, updateMatch } = useMatches();
  const { user } = useAuth();
  const location = useLocation();

  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("Match");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get("view");
    if (view === "practice") {
      setTypeFilter("Practice");
    } else {
      setTypeFilter("Match");
    }
  }, [location]);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [matchForm, setMatchForm] = useState({
    sportName: "Basketball",
    team1: "",
    team2: "",
    date: "",
    time: "",
    venue: "",
    status: "Upcoming",
    score: "",
    type: "Match"
  });

  const canEdit = user?.role && (user.role === 'admin' || user.role.includes('ADMIN') || user.role === 'captain' || user.role === 'vice_captain' || user.role === 'coach');

  const resetForm = () => {
    setMatchForm({
      sportName: "Basketball",
      team1: "",
      team2: "",
      date: "",
      time: "",
      venue: "",
      status: "Upcoming",
      score: "",
      type: "Match"
    });
    setIsEditing(false);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (match) => {
    setMatchForm({
      ...match,
      sportName: match.sportName || "Basketball",
      type: match.type || "Match"
    });
    setIsEditing(true);
    setEditingId(match.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateMatch(editingId, matchForm);
      toast.success("Event updated successfully!");
    } else {
      addMatch(matchForm);
      toast.success("Event added successfully!");
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteMatch(id);
      toast.success("Event deleted successfully!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-700 dark:text-red-400 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const filteredMatches = matches.filter((match) => {
    // Filter by Type
    const matchType = match.type || "Match";
    if (matchType !== typeFilter) return false;

    if (filter === "all") return true;
    if (filter === "upcoming") return match.status === "Upcoming";
    if (filter === "completed") return match.status === "Completed";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          {typeFilter === 'Practice' ? 'Practice Schedule' : 'Match Schedule'}
        </h1>

        <div className="flex gap-4 items-center">
          <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg flex space-x-1">
            <button
              onClick={() => setTypeFilter("Match")}
              className={clsx(
                "px-3 py-1 rounded-md text-sm font-medium transition-all",
                typeFilter === "Match" ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-900"
              )}
            >
              Matches
            </button>
            <button
              onClick={() => setTypeFilter("Practice")}
              className={clsx(
                "px-3 py-1 rounded-md text-sm font-medium transition-all",
                typeFilter === "Practice" ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-900"
              )}
            >
              Practices
            </button>
          </div>

          {canEdit && (
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} className="mr-2" />
              {showAddForm && !isEditing ? "Close Form" : "Add Event"}
            </button>
          )}

          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {["all", "upcoming", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm font-medium capitalize transition-all",
                  filter === f
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Match Form */}
      {showAddForm && canEdit && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">{isEditing ? "Edit Event" : "Add New Event"}</h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={matchForm.type}
              onChange={(e) => setMatchForm({ ...matchForm, type: e.target.value })}
            >
              <option value="Match">Match</option>
              <option value="Practice">Practice</option>
            </select>
            {matchForm.type === "Practice" ? (
              <select
                required
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={matchForm.team1}
                onChange={(e) => setMatchForm({ ...matchForm, team1: e.target.value })}
              >
                <option value="">Select Team</option>
                <option value="Boys Team">Boys Team</option>
                <option value="Girls Team">Girls Team</option>
                <option value="Both Teams">Both Teams</option>
              </select>
            ) : (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team 1</label>
                <input
                  type="text"
                  placeholder="e.g. Lakers"
                  required
                  className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={matchForm.team1}
                  onChange={(e) => setMatchForm({ ...matchForm, team1: e.target.value })}
                />
              </div>
            )}
            {matchForm.type !== "Practice" && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team 2</label>
                <input
                  type="text"
                  placeholder="e.g. Celtics"
                  required
                  className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={matchForm.team2}
                  onChange={(e) => setMatchForm({ ...matchForm, team2: e.target.value })}
                />
              </div>
            )}
            <input
              type="date"
              required
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={matchForm.date}
              onChange={(e) => setMatchForm({ ...matchForm, date: e.target.value })}
            />
            <input
              type="time"
              required
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={matchForm.time}
              onChange={(e) => setMatchForm({ ...matchForm, time: e.target.value })}
            />
            <input
              type="text"
              placeholder="Venue"
              required
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={matchForm.venue}
              onChange={(e) => setMatchForm({ ...matchForm, venue: e.target.value })}
            />
            <select
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={matchForm.sportName}
              onChange={(e) => setMatchForm({ ...matchForm, sportName: e.target.value })}
            >
              <option>Basketball</option>
              <option>Football</option>
              <option>Tennis</option>
              <option>Swimming</option>
              <option>Volleyball</option>
              <option>Elle</option>
              <option>Cricket</option>
              <option>Rugby</option>
              <option>Athletics</option>
              <option>Table Tennis</option>
              <option>Karate</option>
              <option>Badminton</option>
              <option>Gym & Fitness</option>
              <option>Chess</option>
              <option>Carrom</option>
              <option>Kabaddi</option>
            </select>
            <select
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={matchForm.status}
              onChange={(e) => setMatchForm({ ...matchForm, status: e.target.value })}
            >
              <option>Upcoming</option>
              <option>Completed</option>
            </select>
            {matchForm.status === "Completed" && (
              <>
                <input
                  type="text"
                  placeholder="Final Score (e.g., 2-1)"
                  className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={matchForm.score}
                  onChange={(e) => setMatchForm({ ...matchForm, score: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Winner (e.g., VavSport Bulls)"
                  className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={matchForm.winner || ""}
                  onChange={(e) => setMatchForm({ ...matchForm, winner: e.target.value })}
                />
              </>
            )}
            <div className="md:col-span-2 lg:col-span-3">
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                {isEditing ? "Update Event" : "Save Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500 hover:shadow-lg transition-shadow relative group"
          >
            {canEdit && (
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditClick(match)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit Match"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Match"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
            <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Date & Time */}
              <div className="flex flex-col items-center md:items-start min-w-[120px]">
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar size={16} className="mr-2" />
                  <span className="font-medium">{match.date}</span>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock size={16} className="mr-2" />
                  <span>{match.time}</span>
                </div>
                <div className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {match.type === "Practice" ? match.team1 : match.sportName}
                </div>
                <span className={clsx(
                  "mt-2 px-2 py-1 text-xs font-semibold rounded-full",
                  match.status === "Upcoming"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                )}>
                  {match.status}
                </span>
                <span className="mt-1 text-xs text-gray-400 uppercase tracking-wider border px-1 rounded">
                  {match.type || "Match"}
                </span>
              </div>

              {/* Teams */}
              <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white w-full md:w-auto text-center">
                  {match.type === "Practice" ? match.sportName : match.team1}
                </div>
                {match.type !== "Practice" && (
                  <>
                    <div className="text-2xl font-black text-gray-400">VS</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white w-full md:w-auto text-left">
                      {match.team2}
                    </div>
                  </>
                )}
              </div>

              {/* Venue & Score / Winner */}
              <div className="flex flex-col items-center md:items-end min-w-[160px] text-center md:text-right">
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  <span>{match.venue}</span>
                </div>
                {match.status === "Completed" ? (
                  <div className="mt-1 space-y-1">
                    {/* Final Score */}
                    {match.score && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Final Score</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{match.score}</p>
                      </div>
                    )}
                    {/* Winner */}
                    {match.winner ? (
                      <div className="mt-2 flex items-center justify-center md:justify-end gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg px-3 py-1.5">
                        <span className="text-yellow-500 text-lg">🏆</span>
                        <div>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold uppercase tracking-wide">Winner</p>
                          <p className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{match.winner}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">🤝 Draw</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Upcoming</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredMatches.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default Matches;
