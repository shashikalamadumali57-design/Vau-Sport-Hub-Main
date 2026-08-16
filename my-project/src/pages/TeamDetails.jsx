import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageSquare, X, ArrowLeft, Check, Plus, Trash2 } from "lucide-react";
import { sports } from "../data/mockData";
import { useMessages } from "../context/MessageContext";
import { useAuth } from "../context/AuthContext";
import { createJoinRequest, getJoinRequests, updateJoinRequestStatus } from "../services/joinRequestService";
import toast from "react-hot-toast";

const TeamDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("boys");
    const sport = sports.find((s) => s.id === parseInt(id));
    const { sendMessage } = useMessages();
    const { user } = useAuth();

    const [showJoinForm, setShowJoinForm] = useState(false);
    const [joinForm, setJoinForm] = useState({
        faculty: "Faculty of Technology",
        regNo: "",
        message: ""
    });
    const [submitStatus, setSubmitStatus] = useState(null);
    const [joinRequests, setJoinRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    // Fetch requests when tab or sport changes
    useEffect(() => {
        // Simple polling or fetch on mount/tab change
        const fetchRequests = async () => {
            if (!sport || !user) return;
            setLoadingRequests(true);
            try {
                const requests = await getJoinRequests(sport.name, activeTab);
                setJoinRequests(requests);
            } catch (err) {
                // Ignore 403 or errors if not authorized
                // console.log("Not authorized to view requests");
                setJoinRequests([]);
            } finally {
                setLoadingRequests(false);
            }
        };
        fetchRequests();
    }, [sport, activeTab, user]);

    if (!sport) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sport Not Found</h2>
                <Link
                    to="/sports"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Sports
                </Link>
            </div>
        );
    }

    const canEditTeam = user && ["admin", "captain", "vice captain", "coach", "role_admin", "role_captain", "role_vice_captain"].includes(user.role?.toLowerCase() || "");

    const [localMembers, setLocalMembers] = useState([]);
    
    // Load members from localStorage or mockData
    useEffect(() => {
        if (!sport) return;
        const storageKey = `team_${sport.id}_${activeTab}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setLocalMembers(JSON.parse(stored));
        } else {
            const initial = activeTab === "boys" ? sport.boysTeam : sport.girlsTeam;
            setLocalMembers(initial || []);
        }
    }, [sport, activeTab]);

    const teamMembers = localMembers;

    const [searchTerm, setSearchTerm] = useState("");
    
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMember, setNewMember] = useState({ name: "", role: "Member" });

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!newMember.name.trim()) return;
        
        const member = {
            id: Date.now(),
            name: newMember.name,
            role: newMember.role,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name)}&background=random`
        };
        
        const updated = [...localMembers, member];
        setLocalMembers(updated);
        localStorage.setItem(`team_${sport.id}_${activeTab}`, JSON.stringify(updated));
        setNewMember({ name: "", role: "Member" });
        setShowAddMember(false);
        toast.success("Member added successfully!");
    };

    const handleRemoveMember = (memberId) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            const updated = localMembers.filter(m => m.id !== memberId);
            setLocalMembers(updated);
            localStorage.setItem(`team_${sport.id}_${activeTab}`, JSON.stringify(updated));
            toast.success("Member removed successfully!");
        }
    };

    const filteredMembers = teamMembers?.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmitJoinRequest = async (e) => {
        e.preventDefault();
        setSubmitStatus("loading");
        try {
            const requestData = {
                sportName: sport.name,
                teamCategory: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
                faculty: joinForm.faculty,
                regNo: joinForm.regNo,
                message: joinForm.message,
                senderName: user?.username || "Anonymous",
                senderEmail: user?.email || "unknown@example.com"
            };

            await createJoinRequest(requestData);
            setSubmitStatus("success");
            toast.success("Join request sent successfully!");
            setShowJoinForm(false);
            setJoinForm({ faculty: "Faculty of Technology", regNo: "", message: "" });
        } catch (error) {
            console.error("Join Request Error:", error);
            setSubmitStatus("error");
            const errorMessage = error.response?.data
                ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data))
                : error.message || "Failed to send join request.";
            toast.error(`Error: ${errorMessage}`);
        }
    };

    // Handle Accept/Reject actions
    const handleRequestAction = async (requestId, status) => {
        try {
            await updateJoinRequestStatus(requestId, status);
            toast.success(`Request ${status.toLowerCase()} successfully!`);
            // Refresh the requests list
            const requests = await getJoinRequests(sport.name, activeTab);
            setJoinRequests(requests);
        } catch (error) {
            toast.error(error.response?.data || `Failed to ${status.toLowerCase()} request.`);
        }
    };

    const getRoleBadgeColor = (role) => {
        if (role === "Captain") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700";
        if (role === "Vice Captain") return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-700";
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    };

    // Updated Faculty Options and Registration Placeholder - Forced Refresh
    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Link
                to="/sports"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-8"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sports
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-12 relative">
                <div className="h-64 sm:h-80 md:h-96 relative">
                    <img
                        src={sport.image}
                        alt={sport.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-8 w-full flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{sport.name} Team</h1>
                                <p className="text-xl text-gray-200">Head Coach: {sport.coach}</p>
                            </div>
                            {user && user.role !== "admin" && (
                                <button
                                    onClick={() => setShowJoinForm(true)}
                                    className="hidden md:flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                                >
                                    <MessageSquare className="mr-2" size={20} />
                                    Request to Join
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{sport.description}</p>
                    {user && user.role !== "admin" && (
                        <button
                            onClick={() => setShowJoinForm(true)}
                            className="md:hidden w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
                        >
                            <MessageSquare className="mr-2" size={20} />
                            Request to Join
                        </button>
                    )}
                </div>
            </div>

            {/* Join Request Modal */}
            {
                showJoinForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in">
                            <button
                                onClick={() => setShowJoinForm(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Join {sport.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Send a request to the Captain & Vice Captain.</p>

                            <form onSubmit={handleSubmitJoinRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty</label>
                                    <select
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                        value={joinForm.faculty}
                                        onChange={(e) => setJoinForm({ ...joinForm, faculty: e.target.value })}
                                    >
                                        <option>Faculty of Technology</option>
                                        <option>Faculty of Business Studies</option>
                                        <option>Faculty of Applied Science</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Number</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., 2021/ICTS/0"
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                        value={joinForm.regNo}
                                        onChange={(e) => setJoinForm({ ...joinForm, regNo: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder="Briefly describe your experience..."
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                        value={joinForm.message}
                                        onChange={(e) => setJoinForm({ ...joinForm, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Send Request
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h2>
                        {canEditTeam && (
                            <button
                                onClick={() => setShowAddMember(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md transition-colors text-sm font-medium"
                            >
                                <Plus size={16} />
                                Add Member
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        <div className="flex space-x-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg self-start sm:self-auto">
                            <button
                                onClick={() => setActiveTab("boys")}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${activeTab === "boys"
                                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                Boys Team
                            </button>
                            <button
                                onClick={() => setActiveTab("girls")}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${activeTab === "girls"
                                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                Girls Team
                            </button>
                        </div>
                    </div>
                </div>
                {/* Add Member Modal */}
                {showAddMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 relative animate-fade-in">
                            <button
                                onClick={() => setShowAddMember(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add Team Member</h2>
                            <form onSubmit={handleAddMember} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Kasun Perera"
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                        value={newMember.name}
                                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                    <select
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                        value={newMember.role}
                                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                    >
                                        <option>Member</option>
                                        <option>Captain</option>
                                        <option>Vice Captain</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Add Member
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {filteredMembers && filteredMembers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredMembers.map((member) => (
                            <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow relative group">
                                {canEditTeam && (
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove Member"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-100 dark:border-blue-900">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                                        }}
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(member.role)}`}>
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center text-lg italic bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl">
                        {activeTab === 'boys' ? "Boys" : "Girls"} team details are being updated. Check back soon!
                    </p>
                )}
            </div>

            {/* Display Join Requests for Team Members */}
            {
                joinRequests.length > 0 && (
                    <div className="mb-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <MessageSquare className="mr-2 text-blue-600" />
                            Join Requests ({joinRequests.length})
                        </h2>
                        <div className="space-y-4">
                            {joinRequests.map((req) => (
                                <div key={req.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg dark:text-white">{req.senderName}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{req.faculty} - {req.regNo}</p>
                                            <p className="mt-2 text-gray-700 dark:text-gray-200 italic">"{req.message}"</p>
                                            <p className="text-xs text-gray-500 mt-1">{new Date(req.timestamp).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {req.status === "PENDING" && (user?.role === "ROLE_ADMIN" || user?.role === "ROLE_CAPTAIN" || user?.role === "ROLE_VICE_CAPTAIN") ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRequestAction(req.id, "ACCEPTED")}
                                                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                    >
                                                        <Check size={16} className="mr-1" /> Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(req.id, "REJECTED")}
                                                        className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                                    >
                                                        <X size={16} className="mr-1" /> Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${req.status === "PENDING" ? "text-yellow-800 bg-yellow-100" :
                                                    req.status === "ACCEPTED" ? "text-green-800 bg-green-100" :
                                                        "text-red-800 bg-red-100"
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

        </div >

    );
};

export default TeamDetails;
