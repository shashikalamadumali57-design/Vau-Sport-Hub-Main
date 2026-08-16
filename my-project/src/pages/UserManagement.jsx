import { useState } from "react";
import { User, Trash2, Edit, Search, Plus, X, Check, Save } from "lucide-react";
import toast from "react-hot-toast";

const ROLES = ["Admin", "Coach", "Captain", "Vice Captain", "Student"];
const STATUSES = ["Active", "Inactive"];

const INITIAL_USERS = [
    { id: 1, name: "Admin User",      email: "admin@test.com",   role: "Admin",   status: "Active" },
    { id: 2, name: "Coach Mike",      email: "coach@test.com",   role: "Coach",   status: "Active" },
    { id: 3, name: "Captain America", email: "captain@test.com", role: "Captain", status: "Active" },
    { id: 4, name: "John Doe",        email: "student@test.com", role: "Student", status: "Active" },
    { id: 5, name: "Jane Smith",      email: "jane@test.com",    role: "Student", status: "Inactive" },
];

const roleBadge = (role) => {
    const map = {
        Admin:          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        Coach:          "bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-300",
        Captain:        "bg-blue-100   text-blue-800   dark:bg-blue-900/30   dark:text-blue-300",
        "Vice Captain": "bg-cyan-100   text-cyan-800   dark:bg-cyan-900/30   dark:text-cyan-300",
        Student:        "bg-gray-100   text-gray-800   dark:bg-gray-700      dark:text-gray-300",
    };
    return map[role] || map.Student;
};

const UserManagement = () => {
    const [users, setUsers]         = useState(INITIAL_USERS);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId]   = useState(null);      // row being inline-edited
    const [editForm, setEditForm]     = useState({});        // temp values while editing
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student", status: "Active" });

    /* ── Filter ── */
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* ── Delete ── */
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(prev => prev.filter(u => u.id !== id));
            toast.success("User deleted.");
        }
    };

    /* ── Start inline edit ── */
    const startEdit = (user) => {
        setEditingId(user.id);
        setEditForm({ role: user.role, status: user.status });
    };

    /* ── Save inline edit ── */
    const saveEdit = (id) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...editForm } : u));
        setEditingId(null);
        toast.success("User updated successfully!");
    };

    const cancelEdit = () => setEditingId(null);

    /* ── Add User ── */
    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUser.name.trim() || !newUser.email.trim()) {
            toast.error("Name and email are required.");
            return;
        }
        if (users.find(u => u.email === newUser.email)) {
            toast.error("A user with this email already exists.");
            return;
        }
        const created = { ...newUser, id: Date.now() };
        setUsers(prev => [...prev, created]);
        setNewUser({ name: "", email: "", role: "Student", status: "Active" });
        setShowAddModal(false);
        toast.success(`User "${created.name}" added successfully!`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* ── Header ── */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage system access and roles · {users.length} users
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-colors font-medium"
                >
                    <Plus size={20} />
                    Add User
                </button>
            </div>

            {/* ── Table ── */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* Search */}
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50">
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map(user => {
                                const isEditing = editingId === user.id;
                                return (
                                    <tr key={user.id} className={`transition-colors ${isEditing ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}>
                                        {/* User info */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm flex-shrink-0">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role — dropdown when editing */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isEditing ? (
                                                <select
                                                    value={editForm.role}
                                                    onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                                                    className="text-sm border border-blue-400 rounded-md px-2 py-1 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {ROLES.map(r => <option key={r}>{r}</option>)}
                                                </select>
                                            ) : (
                                                <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${roleBadge(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>

                                        {/* Status — dropdown when editing */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isEditing ? (
                                                <select
                                                    value={editForm.status}
                                                    onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                                                    className="text-sm border border-blue-400 rounded-md px-2 py-1 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                                                </select>
                                            ) : (
                                                <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${user.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                                                    {user.status}
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => saveEdit(user.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium"
                                                    >
                                                        <Save size={14} /> Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-xs font-medium"
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                        title="Edit role / status"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Add User Modal ── */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New User</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Kamal Perera"
                                    value={newUser.name}
                                    onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. kamal@vav.com"
                                    value={newUser.email}
                                    onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                    <select
                                        value={newUser.role}
                                        onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {ROLES.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <select
                                        value={newUser.status}
                                        onChange={e => setNewUser(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Check size={18} /> Add User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
