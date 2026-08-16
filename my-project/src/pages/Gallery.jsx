import { useState } from "react";
import { useGallery } from "../context/GalleryContext";
import { useAuth } from "../context/AuthContext";
import { X, Plus, Trash2, PlayCircle } from "lucide-react";

const Gallery = () => {
  const { galleryItems, addGalleryItem, deleteGalleryItem } = useGallery();
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    src: "",
    alt: "",
    category: "General",
    type: "image", // 'image' or 'video'
  });

  const isAdmin = user?.role === "admin";

  const handleAddItem = (e) => {
    e.preventDefault();
    addGalleryItem(newItem);
    setShowAddForm(false);
    setNewItem({
      src: "",
      alt: "",
      category: "General",
      type: "image",
    });
  };

  const [uploadType, setUploadType] = useState("url"); // 'url' or 'file'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, src: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Sports Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">Capturing the best moments of our athletes in action.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} className="mr-2" />
            {showAddForm ? "Close Form" : "Add Media"}
          </button>
        )}
      </div>

      {showAddForm && isAdmin && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 max-w-2xl mx-auto border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Media</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Media Type</label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              >
                <option value="image">Photo</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div className="flex gap-4 mb-2">
              <label className="flex items-center space-x-2 cursor-pointer dark:text-white">
                <input
                  type="radio"
                  checked={uploadType === "url"}
                  onChange={() => setUploadType("url")}
                />
                <span>URL</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer dark:text-white">
                <input
                  type="radio"
                  checked={uploadType === "file"}
                  onChange={() => setUploadType("file")}
                />
                <span>Upload File</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {uploadType === "url" ? "Media URL" : "Choose File"}
              </label>
              {uploadType === "url" ? (
                <input
                  type="text"
                  required={uploadType === "url"}
                  placeholder={newItem.type === 'video' ? "Video URL (mp4, webm)" : "Image URL (jpg, png)"}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={newItem.src}
                  onChange={(e) => setNewItem({ ...newItem, src: e.target.value })}
                />
              ) : (
                <input
                  type="file"
                  required={uploadType === "file"}
                  accept={newItem.type === 'video' ? "video/*" : "image/*"}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  onChange={handleFileChange}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title/Alt Text</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={newItem.alt}
                  onChange={(e) => setNewItem({ ...newItem, alt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                >
                  <option>General</option>
                  <option>Basketball</option>
                  <option>Football</option>
                  <option>Tennis</option>
                  <option>Swimming</option>
                  <option>Awards</option>
                  <option>Campus</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Add to Gallery
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl shadow-lg"
            onClick={() => setSelectedItem(item)}
          >
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteGalleryItem(item.id);
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}

            {item.type === 'video' ? (
              <div className="h-full w-full bg-gray-900 flex items-center justify-center relative">
                <video
                  src={item.src}
                  className="h-full w-full object-cover opacity-80"
                  muted
                  loop
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => e.target.pause()}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PlayCircle className="text-white/80 w-16 h-16" />
                </div>
              </div>
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-6 pointer-events-none">
              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                <p className="font-bold text-lg">{item.category}</p>
                <p className="text-sm text-gray-200">{item.alt}</p>
                {item.type === 'video' && <span className="text-xs bg-blue-600 px-2 py-0.5 rounded mt-1 inline-block">Video</span>}
              </div>
            </div>
          </div>
        ))}
        {galleryItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No items in the gallery yet.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setSelectedItem(null)}>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
            onClick={() => setSelectedItem(null)}
          >
            <X size={32} />
          </button>

          <div className="max-w-5xl max-h-[90vh] w-full flex flex-col items-center">
            {selectedItem.type === 'video' ? (
              <video
                src={selectedItem.src}
                controls
                autoPlay
                className="max-h-[85vh] max-w-full rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={selectedItem.src}
                alt={selectedItem.alt}
                className="max-h-[85vh] max-w-full rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            <div className="mt-4 text-center text-white pointer-events-none">
              <h3 className="text-xl font-bold">{selectedItem.alt}</h3>
              <p className="text-gray-300">{selectedItem.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
