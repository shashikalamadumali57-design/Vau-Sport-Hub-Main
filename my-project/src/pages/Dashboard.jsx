import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import { getNotifications, updateJoinRequestStatus } from "../services/joinRequestService";
import userService from "../services/userService"; // Import userService
import { User, Calendar, Settings, Users, Activity, Award, MessageSquare, Check, X, Camera } from "lucide-react";
import toast from "react-hot-toast";

const CaptainDashboard = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myTeamId, setMyTeamId] = useState(null); // State for team ID
  const navigate = useNavigate(); // Helper for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch notifications regardless of profile status
        const reqData = await getNotifications().catch(err => {
          console.error("Failed to fetch notifications", err);
          return [];
        });
        setRequests(reqData);

        // Try to fetch profile for team info
        try {
          const profileData = await userService.getMyProfile();
          if (profileData.team && profileData.team.sportId) {
            setMyTeamId(profileData.team.sportId);
          }
        } catch (err) {
          console.warn("Failed to fetch user profile/team info", err);
          // Non-critical error, user might not have a team
        }
      } catch (error) {
        console.error("Critical dashboard error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await updateJoinRequestStatus(id, status);
      // Remove from list or update status
      setRequests(prev => prev.filter(req => req.id !== id));
      toast.success(`Request ${status.toLowerCase()}!`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          icon={<Users className="text-blue-500" size={32} />}
          title="My Team"
          description="Manage your team roster and lineups."
          action="View Team"
          onClick={() => {
            if (myTeamId) {
              navigate(`/sports/${myTeamId}`);
            } else {
              // Fallback for demo/testing or if profile fetch failed
              console.warn("Team ID not found, defaulting to Basketball (ID 1)");
              toast("Navigating to default team...", { icon: '⚠️' });
              navigate(`/sports/1`);
            }
          }}
        />
        <DashboardCard
          icon={<MessageSquare className="text-green-500" size={32} />}
          title="Join Requests"
          description={`You have ${requests.length} pending join requests.`}
          action="Review"
          onClick={() => document.getElementById('captain-join-requests')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <DashboardCard
          icon={<Activity className="text-purple-500" size={32} />}
          title="Practice Schedule"
          description="Coordinate upcoming practice sessions."
          action="Manage"
          onClick={() => navigate("/matches?view=practice")} // Link to matches page with practice view
        />
      </div>

      <div id="captain-join-requests" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pending Join Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Student</th>
                  <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Details</th>
                  <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Message</th>
                  <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{req.senderName}</p>
                        <p className="text-sm text-gray-500">{req.senderEmail}</p>
                        <p className="text-xs text-gray-400">{new Date(req.timestamp).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="py-3 text-gray-700 dark:text-gray-300">
                      <p>{req.faculty}</p>
                      <p className="text-sm text-gray-500">{req.regNo}</p>
                      <p className="text-xs text-blue-500">{req.sportName} - {req.teamCategory}</p>
                    </td>
                    <td className="py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate" title={req.message}>
                      {req.message}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleAction(req.id, "ACCEPTED")}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <Check size={14} className="mr-1" /> Accept
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "REJECTED")}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                      >
                        <X size={14} className="mr-1" /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No pending requests.</p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { messages } = useMessages();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem(`profilePic_${user?.username}`) || null;
  });

  useEffect(() => {
    if (user?.username) {
      const storedPic = localStorage.getItem(`profilePic_${user.username}`);
      if (storedPic) {
        setProfilePic(storedPic);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Please choose a file under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfilePic(base64);
      localStorage.setItem(`profilePic_${user.username}`, base64);
      toast.success("Profile picture updated!");
    };
    reader.readAsDataURL(file);
  };

  const renderRoleContent = () => {
    switch (user.role) {
      case "admin":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                icon={<Users className="text-blue-500" size={32} />}
                title="Manage Users"
                description="Add, edit, or remove students and coaches."
                action="Manage"
                onClick={() => navigate("/users")}
              />
              <DashboardCard
                icon={<Calendar className="text-green-500" size={32} />}
                title="Event Scheduling"
                description="Create and manage sports events and matches."
                action="Schedule"
                onClick={() => navigate("/matches")}
              />
              <DashboardCard
                icon={<Settings className="text-gray-500" size={32} />}
                title="System Settings"
                description="Configure website settings and announcements."
                action="Configure"
                onClick={() => navigate("/announcements")}
              />
            </div>

            {/* Admin Join Request Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pending Join Requests (All Sports)</h3>
              <AdminJoinRequestTable />
            </div>

            {/* Contact Messages Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Messages</h3>
              <ContactMessagesTable messages={messages} />
            </div>
          </div>
        );
      case "coach":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              icon={<Users className="text-blue-500" size={32} />}
              title="Team Roster"
              description="View and manage your team members."
              action="View Team"
              onClick={() => navigate("/sports/1")} // Defaulting to Basketball ID 1 for now
            />
            <DashboardCard
              icon={<Activity className="text-red-500" size={32} />}
              title="Training Sessions"
              description="Schedule and track training sessions."
              action="Plan"
              onClick={() => navigate("/matches")}
            />
            <DashboardCard
              icon={<TrophyIcon className="text-yellow-500" size={32} />}
              title="Match Results"
              description="Update scores and match outcomes."
              action="Update"
              onClick={() => navigate("/matches")}
            />
          </div>
        );
      case "member":
        const memberJoinRequests = messages.filter(m => m.type === "join_request");
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                icon={<Calendar className="text-blue-500" size={32} />}
                title="My Schedule"
                description="View your upcoming matches and practice sessions."
                action="View"
                onClick={() => navigate("/matches")}
              />
              <DashboardCard
                icon={<MessageSquare className="text-green-500" size={32} />}
                title="Team Requests"
                description={`Alert: You have ${memberJoinRequests.length} new join requests!`}
                action="View All"
                onClick={() => document.getElementById('new-team-requests')?.scrollIntoView({ behavior: 'smooth' })}
              />
              <DashboardCard
                icon={<Activity className="text-purple-500" size={32} />}
                title="My Stats"
                description="Track your performance and participation."
                action="Check"
                onClick={() => navigate("/stats")}
              />
            </div>

            <div id="new-team-requests" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">New Team Join Requests</h3>
              {memberJoinRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Student</th>
                        <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Faculty</th>
                        <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Reg No</th>
                        <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Sport</th>
                        <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Message</th>
                        <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {memberJoinRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{req.senderName}</p>
                              <p className="text-sm text-gray-500">{req.senderEmail}</p>
                            </div>
                          </td>
                          <td className="py-3 text-gray-700 dark:text-gray-300">{req.faculty}</td>
                          <td className="py-3 text-gray-700 dark:text-gray-300">{req.regNo}</td>
                          <td className="py-3 text-gray-700 dark:text-gray-300">
                            {req.sport} ({req.team})
                          </td>
                          <td className="py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate" title={req.message}>
                            {req.message}
                          </td>
                          <td className="py-3 text-gray-500 text-sm">
                            {new Date(req.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No new requests.</p>
              )}
            </div>
          </div>
        );
      case "captain":
        return <CaptainDashboard user={user} />;
      default: // student
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              icon={<Calendar className="text-blue-500" size={32} />}
              title="My Schedule"
              description="View your upcoming matches and practice sessions."
              action="View"
              onClick={() => navigate("/matches")}
            />
            <DashboardCard
              icon={<Activity className="text-green-500" size={32} />}
              title="My Stats"
              description="Track your performance and participation."
              action="Check"
              onClick={() => navigate("/stats")}
            />
            <DashboardCard
              icon={<Award className="text-purple-500" size={32} />}
              title="Achievements"
              description="View your badges and certificates."
              action="View"
              onClick={() => navigate("/gallery")}
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          {/* Profile Picture with Upload Button */}
          <div className="relative group flex-shrink-0">
            <img
              src={profilePic || user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff&size=128`}
              alt={user.username}
              className="h-24 w-24 rounded-full border-4 border-blue-100 dark:border-blue-900 object-cover"
            />
            {/* Camera overlay button */}
            <label
              htmlFor="profile-pic-upload"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Change profile picture"
            >
              <Camera size={24} className="text-white" />
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
            {/* Small camera badge always visible */}
            <label
              htmlFor="profile-pic-upload"
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 cursor-pointer shadow-md"
              title="Change profile picture"
            >
              <Camera size={14} />
            </label>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.username}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 capitalize mt-1 flex items-center">
              <User size={16} className="mr-1" /> {user.role} Dashboard
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click the camera icon to change your profile photo</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
      {renderRoleContent()}
    </div>
  );
};

const DashboardCard = ({ icon, title, description, action, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition-shadow cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
    <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
      {action} &rarr;
    </button>
  </div>
);

const TrophyIcon = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);


const AdminJoinRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getNotifications();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await updateJoinRequestStatus(id, status);
      setRequests(prev => prev.filter(req => req.id !== id));
      toast.success(`Request ${status.toLowerCase()}!`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    requests.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Student</th>
              <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Details</th>
              <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Message</th>
              <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{req.senderName}</p>
                    <p className="text-sm text-gray-500">{req.senderEmail}</p>
                    <p className="text-xs text-gray-400">{new Date(req.timestamp).toLocaleDateString()}</p>
                  </div>
                </td>
                <td className="py-3 text-gray-700 dark:text-gray-300">
                  <p>{req.faculty}</p>
                  <p className="text-sm text-gray-500">{req.regNo}</p>
                  <p className="text-xs text-blue-500">{req.sportName} - {req.teamCategory}</p>
                </td>
                <td className="py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate" title={req.message}>
                  {req.message}
                </td>
                <td className="py-3 text-right space-x-2">
                  <button
                    onClick={() => handleAction(req.id, "ACCEPTED")}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <Check size={14} className="mr-1" /> Accept
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "REJECTED")}
                    className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X size={14} className="mr-1" /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400 text-center py-8">No pending requests found.</p>
    )
  );
};

const ContactMessagesTable = ({ messages }) => {
  const [contactMessages, setContactMessages] = useState([]);

  useEffect(() => {
    // Filter only contact type messages
    const contacts = messages.filter(m => m.type === 'contact');
    setContactMessages(contacts);
  }, [messages]);

  const handleDelete = (id) => {
    // Remove from local state
    setContactMessages(prev => prev.filter(msg => msg.id !== id));

    // Update localStorage
    const allMessages = JSON.parse(localStorage.getItem("teamMessages") || "[]");
    const updatedMessages = allMessages.filter(msg => msg.id !== id);
    localStorage.setItem("teamMessages", JSON.stringify(updatedMessages));

    toast.success("Message deleted successfully");
  };

  const handleMarkAsRead = (id) => {
    // Update status in local state
    setContactMessages(prev =>
      prev.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg)
    );

    // Update localStorage
    const allMessages = JSON.parse(localStorage.getItem("teamMessages") || "[]");
    const updatedMessages = allMessages.map(msg =>
      msg.id === id ? { ...msg, status: 'read' } : msg
    );
    localStorage.setItem("teamMessages", JSON.stringify(updatedMessages));

    toast.success("Marked as read");
  };

  if (contactMessages.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
        No contact messages yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Status</th>
            <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Contact Info</th>
            <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Message</th>
            <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold">Date</th>
            <th className="pb-3 text-gray-600 dark:text-gray-400 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-700">
          {contactMessages.map((msg) => (
            <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="py-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${msg.status === 'read'
                  ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                  {msg.status === 'read' ? 'Read' : 'Unread'}
                </span>
              </td>
              <td className="py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{msg.name}</p>
                  <p className="text-sm text-gray-500">{msg.email}</p>
                </div>
              </td>
              <td className="py-3 text-gray-700 dark:text-gray-300 max-w-md">
                <p className="line-clamp-2" title={msg.message}>
                  {msg.message}
                </p>
              </td>
              <td className="py-3 text-gray-500 text-sm">
                {new Date(msg.timestamp).toLocaleDateString()}
                <br />
                <span className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </td>
              <td className="py-3 text-right space-x-2">
                {msg.status !== 'read' && (
                  <button
                    onClick={() => handleMarkAsRead(msg.id)}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Check size={14} className="mr-1" /> Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors text-sm"
                >
                  <X size={14} className="mr-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
