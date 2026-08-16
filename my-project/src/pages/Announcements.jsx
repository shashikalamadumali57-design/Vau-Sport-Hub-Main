import { useState } from "react";
import { useAnnouncements } from "../context/AnnouncementContext";
import { useAuth } from "../context/AuthContext";
import { Bell, User, Calendar, Plus, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

const Announcements = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement, error } = useAnnouncements();
  const { user } = useAuth();

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    author: "Admin Office",
    content: "",
  });

  const isAdmin = user?.role && (user.role === 'admin' || user.role.includes('ADMIN'));

  const resetForm = () => {
    setForm({
      title: "",
      date: "",
      author: "Admin Office",
      content: "",
    });
    setIsEditing(false);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (item) => {
    setForm(item);
    setIsEditing(true);
    setEditingId(item.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateAnnouncement(editingId, form);
      toast.success("Announcement updated successfully!");
    } else {
      addAnnouncement(form);
      toast.success("Announcement posted successfully!");
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement(id);
      toast.success("Announcement deleted successfully!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Bell className="text-blue-600 dark:text-blue-400 mr-3" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements & News</h1>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} className="mr-2" />
            {showAddForm && !isEditing ? "Close Form" : "Add Announcement"}
          </button>
        )}
      </div>

      {showAddForm && isAdmin && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">{isEditing ? "Edit Announcement" : "New Announcement"}</h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
              <textarea
                required
                rows="4"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              {isEditing ? "Update Announcement" : "Post Announcement"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {announcements.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>

            {isAdmin && (
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditClick(item)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">{item.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" /> {item.date}
                </span>
                <span className="flex items-center">
                  <User size={14} className="mr-1" /> {item.author}
                </span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </p>
            </div>
          </div>
        ))}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <p className="text-red-700 dark:text-red-400 font-semibold text-center">{error}</p>
            <p className="text-sm text-red-500 dark:text-red-300 text-center mt-2">Check console for more details.</p>
          </div>
        )}
        {announcements.length === 0 && !error && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No announcements yet.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
