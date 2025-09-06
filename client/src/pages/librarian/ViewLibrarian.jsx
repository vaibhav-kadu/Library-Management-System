import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Loader, Edit2, Trash2, Save, X, Search, Image } from "lucide-react";

export default function ViewLibrarian({ theme = "light" }) {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch librarians
  const fetchLibrarians = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getLibrarian");
      if (response.data.success) {
        setLibrarians(response.data.librarians);
      } else {
        setError("Failed to load librarians");
      }
    } catch (err) {
      setError("Server error while fetching librarians");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrarians();
  }, []);

  // Edit
  const handleEdit = (lib) => {
    setEditingId(lib.librarian_id || lib.id);
    setEditingData({
      name: lib.name,
      email: lib.email,
      contact: lib.contact,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({ name: "", email: "", contact: "" });
  };

  // Update
  const handleUpdate = async (librarianId) => {
    if (!editingData.name.trim() || !editingData.email.trim()) {
      setError("Name and Email cannot be empty");
      return;
    }

    setUpdating(librarianId);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(
        `http://localhost:3000/updateLibrarian`,
        { id: librarianId, ...editingData }
      );

      if (response.data.success) {
        setLibrarians(
          librarians.map((lib) =>
            (lib.librarian_id || lib.id) === librarianId
              ? { ...lib, ...editingData }
              : lib
          )
        );
        setEditingId(null);
        setSuccess("Librarian updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to update librarian");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update librarian");
    } finally {
      setUpdating(null);
    }
  };

  // Delete
  const handleDelete = async (librarianId, librarianName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete librarian "${librarianName}"?`
      )
    ) {
      return;
    }

    setDeleting(librarianId);
    setError(null);
    setSuccess(null);

    try {
      // ✅ Pass ID as query param instead of body
      const response = await axios.delete(
        `http://localhost:3000/deleteLibrarian?id=${librarianId}`
      );

      if (response.data.success) {
        setLibrarians(
          librarians.filter((lib) => (lib.librarian_id || lib.id) !== librarianId)
        );
        setSuccess("Librarian deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to delete librarian");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete librarian");
    } finally {
      setDeleting(null);
    }
  };

  // Search filter
  const filteredLibrarians = librarians.filter(
    (lib) =>
      lib.name.toLowerCase().includes(search.toLowerCase()) ||
      lib.email.toLowerCase().includes(search.toLowerCase()) ||
      (lib.contact || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
    >
      <div
        className={`max-w-5xl mx-auto rounded-2xl shadow-lg overflow-hidden ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`px-8 py-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-full ${
                theme === "dark" ? "bg-blue-600/20" : "bg-blue-100"
              }`}
            >
              <User
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Librarians
              </h2>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Manage librarian accounts and profiles
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Search */}
          <div className="mb-6 flex items-center relative">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="Search librarians..."
            />
          </div>

          {/* Error / Success */}
          {error && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                theme === "dark"
                  ? "bg-red-900/20 border-red-800 text-red-400"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                theme === "dark"
                  ? "bg-green-900/20 border-green-800 text-green-400"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              {success}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader
                className={`w-6 h-6 animate-spin ${
                  theme === "dark" ? "text-blue-400" : "text-blue-500"
                }`}
              />
              <span
                className={`ml-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Loading librarians...
              </span>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div
              className={`rounded-xl border overflow-hidden ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <table className="w-full">
                <thead
                  className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
                >
                  <tr>
                    {["Sr. No", "Profile", "Name", "Email", "Contact", "Actions"].map(
                      (col) => (
                        <th
                          key={col}
                          className={`py-4 px-6 text-left text-sm font-semibold ${
                            theme === "dark" ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredLibrarians.length > 0 ? (
                    filteredLibrarians.map((lib, index) => {
                      const librarianId = lib.librarian_id || lib.id;
                      const isEditing = editingId === librarianId;

                      return (
                        <tr
                          key={librarianId}
                          className={`${
                            theme === "dark"
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td
                            className={`py-4 px-6 ${
                              theme === "dark" ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {index + 1}
                          </td>
                          <td className="py-4 px-6">
                            {lib.profileImage ? (
                              <img
                                src={`http://localhost:3000/uploads/${lib.profileImage}`}
                                alt={lib.name}
                                className="w-10 h-10 rounded-full object-cover border"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/default-avatar.png"; // fallback
                                }}
                              />
                            ) : (
                              <Image className="w-10 h-10 text-gray-400" />
                            )}
                          </td>
                          <td
                            className={`py-4 px-6 ${
                              theme === "dark" ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingData.name}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    name: e.target.value,
                                  })
                                }
                                className="px-2 py-1 border rounded-lg w-full"
                              />
                            ) : (
                              lib.name
                            )}
                          </td>
                          <td
                            className={`py-4 px-6 ${
                              theme === "dark" ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {isEditing ? (
                              <input
                                type="email"
                                value={editingData.email}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    email: e.target.value,
                                  })
                                }
                                className="px-2 py-1 border rounded-lg w-full"
                              />
                            ) : (
                              lib.email
                            )}
                          </td>
                          <td
                            className={`py-4 px-6 ${
                              theme === "dark" ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingData.contact}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    contact: e.target.value,
                                  })
                                }
                                className="px-2 py-1 border rounded-lg w-full"
                              />
                            ) : (
                              lib.contact
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleUpdate(librarianId)}
                                  disabled={updating === librarianId}
                                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 mr-2"
                                >
                                  {updating === librarianId ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Save className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(lib)}
                                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 mr-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(librarianId, lib.name)
                                  }
                                  disabled={deleting === librarianId}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                >
                                  {deleting === librarianId ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className={`text-center py-8 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No librarians found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
