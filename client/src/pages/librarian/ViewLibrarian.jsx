import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { User, Loader, Edit2, Trash2, Search, UserCircle } from "lucide-react";
import AddLibrarian from "./AddLibrarian"; // Import the AddLibrarian component

export default function ViewLibrarian({ theme = "light" }) {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [showAddLibrarian, setShowAddLibrarian] = useState(false);
  const [editingLibrarian, setEditingLibrarian] = useState(null);
  
  const isDark = theme === 'dark';

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

  // Edit - Open AddLibrarian component with existing data
  const handleEdit = (lib) => {
    setEditingLibrarian(lib);
    setShowAddLibrarian(true);
  };

  // Delete
  const handleDelete = async (lid, librarianName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete librarian "${librarianName}"?`
      )
    ) {
      return;
    }

    setDeleting(lid);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.delete(
        `http://localhost:3000/deleteLibrarian?lid=${lid}`
      );

      if (response.data.success) {
        setLibrarians(
          librarians.filter((lib) => (lib.lid || lib.lid) !== lid)
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

  // Handle close AddLibrarian modal
  const handleCloseAddLibrarian = () => {
    setShowAddLibrarian(false);
    setEditingLibrarian(null);
  };

  // Handle successful update
  const handleUpdateSuccess = () => {
    setShowAddLibrarian(false);
    setEditingLibrarian(null);
    fetchLibrarians(); // Refresh the list
    setSuccess("Librarian updated successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // Search filter
  const filteredLibrarians = librarians.filter(
    (lib) =>
      lib.name.toLowerCase().includes(search.toLowerCase()) ||
      lib.email.toLowerCase().includes(search.toLowerCase()) ||
      (lib.contact || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={`max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Compact Header */}
        <div className={`px-6 py-4 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-blue-600/20" : "bg-blue-100"
              }`}>
                <User className={`w-5 h-5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`} />
              </div>
              <h2 className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Librarians Management
              </h2>
            </div>
            
            {/* Search Bar in Header */}
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                Total: {filteredLibrarians.length}
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Search librarians..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content with reduced padding */}
        <div className="p-4">
          {/* Error / Success - More compact */}
          {error && (
            <div className={`mb-3 p-3 rounded-lg border text-sm ${
              isDark
                ? "bg-red-900/20 border-red-800 text-red-400"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {error}
            </div>
          )}
          {success && (
            <div className={`mb-3 p-3 rounded-lg border text-sm ${
              isDark
                ? "bg-green-900/20 border-green-800 text-green-400"
                : "bg-green-50 border-green-200 text-green-700"
            }`}>
              {success}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-8">
              <Loader className={`w-5 h-5 animate-spin ${
                isDark ? "text-blue-400" : "text-blue-500"
              }`} />
              <span className={`ml-2 text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                Loading librarians...
              </span>
            </div>
          )}

          {/* Optimized Table with proper borders */}
          {!loading && !error && (
            <div className={`rounded-lg border overflow-x-auto ${
              isDark ? "border-gray-600" : "border-gray-300"
            }`}>
              <table className="w-full">
                <thead className={isDark ? "bg-gray-700/50" : "bg-gray-50"}>
                  <tr className={`border-b ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                    <th className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                      isDark ? "text-gray-300 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      #
                    </th>
                    <th className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                      isDark ? "text-gray-300 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      Profile
                    </th>
                    <th className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                      isDark ? "text-gray-300 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      Name
                    </th>
                    <th className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                      isDark ? "text-gray-300 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      Email
                    </th>
                    <th className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                      isDark ? "text-gray-300 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      Contact
                    </th>
                    <th className={`py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-600" : "divide-gray-300"}`}>
                  {filteredLibrarians.length > 0 ? (
                    filteredLibrarians.map((lib, index) => {
                      const lid = lib.lid || lib.lid;

                      return (
                        <tr
                          key={lid}
                          className={`transition-colors border-b ${
                            isDark
                              ? "hover:bg-gray-700/30 border-gray-600"
                              : "hover:bg-gray-50 border-gray-300"
                          }`}
                        >
                          <td className={`py-3 px-4 text-sm font-medium border-r ${
                            isDark ? "text-gray-300 border-gray-600" : "text-gray-900 border-gray-300"
                          }`}>
                            {index + 1}
                          </td>
                          <td className={`py-3 px-4 border-r ${
                            isDark ? "border-gray-600" : "border-gray-300"
                          }`}>
                            <div className="relative group">
                              {lib.profileImage ? (
                                <div className="relative">
                                  <img
                                    src={`http://localhost:3000/librarian_images/${lib.profileImage}?${Date.now()}`}
                                    alt={lib.name}
                                    className={`w-16 h-16 rounded-lg object-cover border-2 shadow-md transition-transform group-hover:scale-105 ${
                                      isDark ? 'border-gray-600' : 'border-gray-300'
                                    }`}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center">
                                    <UserCircle className="w-10 h-10 text-gray-500" />
                                  </div>
                                </div>
                              ) : (
                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center transition-colors group-hover:bg-opacity-80 ${
                                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  <UserCircle className={`w-10 h-10 ${
                                    isDark ? 'text-gray-500' : 'text-gray-400'
                                  }`} />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className={`py-4 px-4 border-r ${
                            isDark ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-300"
                          }`}>
                            <span className="text-sm font-medium">{lib.name}</span>
                          </td>
                          <td className={`py-4 px-4 border-r ${
                            isDark ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-300"
                          }`}>
                            <span className="text-sm">{lib.email}</span>
                          </td>
                          <td className={`py-4 px-4 border-r ${
                            isDark ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-300"
                          }`}>
                            <span className="text-sm">{lib.contact || '-'}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(lib)}
                                className={`p-2.5 rounded-lg transition-all transform hover:scale-105 ${
                                  isDark
                                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                }`}
                                title="Edit"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(lid, lib.name)}
                                disabled={deleting === lid}
                                className={`p-2.5 rounded-lg transition-all transform hover:scale-105 ${
                                  isDark
                                    ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                } ${deleting === lid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Delete"
                              >
                                {deleting === lid ? (
                                  <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className={`text-center py-12 text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
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

      {/* AddLibrarian Modal */}
      {showAddLibrarian && (
        <AddLibrarian
          onClose={handleCloseAddLibrarian}
          theme={theme}
          editingLibrarian={editingLibrarian}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
}