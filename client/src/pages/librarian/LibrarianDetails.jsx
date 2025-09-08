import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, UserCheck, Mail, Phone, Calendar, UserCircle, Loader, Shield } from "lucide-react";

export default function LibrarianDetails({ librarianId, onClose, theme = "light" }) {
  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchLibrarianDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/getLibrarianById",{params:{lid:librarianId}});
        
        if (response.data.success) {          
          setLibrarian(response.data.librarian);
        } else {
          setError("Failed to load librarian details");
        }
      } catch (err) {
        setError("Server error while fetching librarian details"+err);
      } finally {
        setLoading(false);
      }
    };

    if (librarianId) {
      fetchLibrarianDetails();
    }
  }, [librarianId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!librarianId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? "bg-purple-600/20" : "bg-purple-100"
            }`}>
              <UserCheck className={`w-5 h-5 ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`} />
            </div>
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Librarian Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader className={`w-6 h-6 animate-spin ${
                isDark ? "text-purple-400" : "text-purple-500"
              }`} />
              <span className={`ml-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                Loading librarian details...
              </span>
            </div>
          )}

          {error && (
            <div className={`p-4 rounded-lg border text-center ${
              isDark
                ? "bg-red-900/20 border-red-800 text-red-400"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {error}
            </div>
          )}

          {librarian && !loading && !error && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {librarian.profileImage ? (
                    <img
                      src={`http://localhost:3000/librarian_images/${librarian.profileImage}?${Date.now()}`}
                      alt={librarian.name}
                      className={`w-24 h-24 rounded-full object-cover border-4 shadow-lg ${
                        isDark ? 'border-gray-600' : 'border-gray-300'
                      }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-lg ${
                    librarian.profileImage ? 'hidden' : 'flex'
                  } ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'
                  }`}>
                    <UserCircle className={`w-16 h-16 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {librarian.name}
                    </h4>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-800'
                    }`}>
                      <Shield className="w-3 h-3" />
                      Librarian
                    </div>
                  </div>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Librarian ID: #{librarian.lid}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h5 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Contact Information
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className={`w-4 h-4 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <span className={`font-medium text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Email
                      </span>
                    </div>
                    <p className={`text-sm break-all ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {librarian.email}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className={`w-4 h-4 ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`font-medium text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Contact
                      </span>
                    </div>
                    <p className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {librarian.contact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h5 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Account Information
                </h5>

                <div className="grid grid-cols-1 gap-4">
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className={`w-4 h-4 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <span className={`font-medium text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Member Since
                      </span>
                    </div>
                    <p className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatDate(librarian.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Access Level */}
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-purple-900/20 border-purple-800' 
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <h5 className={`font-semibold mb-2 flex items-center gap-2 ${
                  isDark ? 'text-purple-400' : 'text-purple-800'
                }`}>
                  <Shield className="w-4 h-4" />
                  Access Level
                </h5>
                <p className={`text-sm ${
                  isDark ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  This librarian has full access to the library management system including student verification, 
                  book issuing and returning, and administrative functions.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <h5 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Information
                </h5>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border text-center ${
                    isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`text-2xl font-bold mb-1 ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>
                      Active
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Account Status
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border text-center ${
                    isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`text-2xl font-bold mb-1 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      Admin
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Permission Level
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}