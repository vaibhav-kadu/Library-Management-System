import React, { useEffect, useState } from "react";
import api from '../../utils/api';
import { User, Loader, Edit2, Trash2, Search, UserCircle, CheckCircle, XCircle } from "lucide-react";
import AddStudent from "./AddStudent";
import StudentProfile from "./StudentProfile";
import { useAuth } from "../../context/authContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function ViewStudent({ theme = "light" }) {
    const { user} = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [verifying, setVerifying] = useState(null);
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const isDark = theme === 'dark';

  // Get current librarian sid from localStorage or session
  const getCurrentLibrarianId = () => {
    return user.lid;
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await api.get('/getStudents');
      if (response.data.success) {
        setStudents(response.data.students);
      } else {
        setError("Failed to load students");
      }
    } catch (err) {
      setError("Server error while fetching students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Edit - Open AddStudent component with existing data
  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowAddStudent(true);
  };

  // Handle student row click to show profile
  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setShowStudentProfile(true);
  };

  // Verify student
  const handleVerifyStudent = async (sid) => {
    const lid = getCurrentLibrarianId();
    if (!lid) {
      setError("Please log in as a librarian to verify students");
      return;
    }

    setVerifying(sid);
    setError(null);

    try {
      const response = await api.post('/verifyStudent', {
        sid: sid,
        lid: lid
      });

      if (response.data.success) {
        // Update the student in the list
        setStudents(students.map(student => 
          (student.sid || student.sid) === sid 
            ? { ...student, lid: lid, verified: true }
            : student
        ));
        setSuccess("Student verified successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to verify student");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to verify student");
    } finally {
      setVerifying(null);
    }
  };


const handleDelete = async (sid, studentName) => {
  if (!window.confirm(`Are you sure you want to delete "${studentName}"?`)) {
    return;
  }

  setDeleting(sid);
  setError(null);
  setSuccess(null);

  try {
    // Fixed: Use URL parameter instead of request body
    const response = await api.delete(`/deleteStudent/${sid}`);

    if (response.data.success || response.data.message === "Student Deleted") {
      setStudents(
        students.filter((stu) => (stu.sid || stu.sid) !== sid)
      );
      setSuccess("Student deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError("Failed to delete student");
    }
  } catch (err) {
    setError(err.response?.data?.error || err.response?.data?.message || "Failed to delete student");
  } finally {
    setDeleting(null);
  }
};

  // Handle close AddStudent modal
  const handleCloseAddStudent = () => {
    setShowAddStudent(false);
    setEditingStudent(null);
  };

  // Handle successful update
  const handleUpdateSuccess = () => {
    setShowAddStudent(false);
    setEditingStudent(null);
    fetchStudents(); // Refresh the list
    setSuccess("Student updated successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // Handle close StudentProfile modal
  const handleCloseStudentProfile = () => {
    setShowStudentProfile(false);
    setSelectedStudent(null);
  };

  // Search filter
  const filteredStudents = students.filter(
    (stu) =>
      stu.name.toLowerCase().includes(search.toLowerCase()) ||
      stu.email.toLowerCase().includes(search.toLowerCase()) ||
      (stu.contact || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={`max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
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
                Students Management
              </h2>
            </div>
            
            {/* Search Bar in Header */}
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                Total: {filteredStudents.length}
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
                  placeholder="Search students..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Error / Success */}
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
                Loading students...
              </span>
            </div>
          )}

          {/* Table with proper borders */}
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
                    <th className={`py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider border-r ${
                      isDark ? "text-gray-300 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      Status
                    </th>
                    <th className={`py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-600" : "divide-gray-300"}`}>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((stu, index) => {
                      const sid = stu.sid || stu.sid;
                      const isVerified = stu.lid != null;
                      return (
                        <tr
                          key={sid}
                          className={`transition-colors border-b cursor-pointer ${
                            isDark
                              ? "hover:bg-gray-700/30 border-gray-600"
                              : "hover:bg-gray-50 border-gray-300"
                          }`}
                          onClick={() => handleRowClick(stu)}
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
                              {stu.profileImage ? (
                                <div className="relative">
                                  <img
                                    src={`${BASE_URL}/student_images/${stu.profileImage}?${Date.now()}`}
                                    alt={stu.name}
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
                            <span className="text-sm font-medium">{stu.name}</span>
                          </td>
                          <td className={`py-4 px-4 border-r ${
                            isDark ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-300"
                          }`}>
                            <span className="text-sm">{stu.email}</span>
                          </td>
                          <td className={`py-4 px-4 border-r ${
                            isDark ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-300"
                          }`}>
                            <span className="text-sm">{stu.contact || '-'}</span>
                          </td>
                          <td className={`py-4 px-4 text-center border-r ${
                            isDark ? "border-gray-600" : "border-gray-300"
                          }`} onClick={(e) => e.stopPropagation()}>
                            {isVerified ? (
                              <div className="flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-500" title="Verified" />
                              </div>
                            ) : (
                              <button
                                onClick={() => handleVerifyStudent(sid)}
                                disabled={verifying === sid}
                                className={`p-2 rounded-lg transition-all transform hover:scale-105 ${
                                  isDark
                                    ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                } ${verifying === sid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Click to verify student"
                              >
                                {verifying === sid ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </td>
                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(stu)}
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
                                onClick={() => handleDelete(sid, stu.name)}
                                disabled={deleting === sid}
                                className={`p-2.5 rounded-lg transition-all transform hover:scale-105 ${
                                  isDark
                                    ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                } ${deleting === sid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Delete"
                              >
                                {deleting === sid ? (
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
                        colSpan="7"
                        className={`text-center py-12 text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* AddStudent Modal */}
      {showAddStudent && (
        <AddStudent
          onClose={handleCloseAddStudent}
          theme={theme}
          editingStudent={editingStudent}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* StudentProfile Modal */}
      {showStudentProfile && (
        <StudentProfile
          student={selectedStudent}
          onClose={handleCloseStudentProfile}
          theme={theme}
        />
      )}
    </>
  );
}