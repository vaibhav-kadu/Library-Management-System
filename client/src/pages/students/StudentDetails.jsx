import React, { useEffect, useState } from "react";
import api from '../../utils/api';
import { X, User, Mail, Phone, MapPin, Calendar, UserCircle, Loader, CheckCircle, XCircle } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function StudentDetails({ studentId, onClose, theme = "light" }) {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isDark = theme === 'dark';

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get('/getStudentById', {
                    params: { sid: studentId }
                });

                if (response.data.success) {
                    setStudent(response.data.student);
                } else {
                    setError("Failed to load student details");
                }
            } catch (err) {
                setError("Server error while fetching student details");
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudentDetails();
        }
    }, [studentId]);

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

    if (!studentId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-2xl rounded-lg shadow-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                    }`}>
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isDark ? "bg-green-600/20" : "bg-green-100"
                            }`}>
                            <User className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"
                                }`} />
                        </div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            Student Details
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isDark
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
                            <Loader className={`w-6 h-6 animate-spin ${isDark ? "text-green-400" : "text-green-500"
                                }`} />
                            <span className={`ml-2 ${isDark ? "text-gray-300" : "text-gray-600"
                                }`}>
                                Loading student details...
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className={`p-4 rounded-lg border text-center ${isDark
                            ? "bg-red-900/20 border-red-800 text-red-400"
                            : "bg-red-50 border-red-200 text-red-700"
                            }`}>
                            {error}
                        </div>
                    )}

                    {student && !loading && !error && (
                        <div className="space-y-6">
                            {/* Profile Section */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    {student.profileImage ? (
                                        <img
                                            src={`${BASE_URL}/student_images/${student.profileImage}?${Date.now()}`}
                                            alt={student.name}
                                            className={`w-24 h-24 rounded-full object-cover border-4 shadow-lg ${isDark ? 'border-gray-600' : 'border-gray-300'
                                                }`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-lg ${student.profileImage ? 'hidden' : 'flex'
                                        } ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'
                                        }`}>
                                        <UserCircle className={`w-16 h-16 ${isDark ? 'text-gray-500' : 'text-gray-400'
                                            }`} />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {student.name}
                                        </h4>
                                        {student.lid ? (
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-800'
                                                }`}>
                                                <CheckCircle className="w-3 h-3" />
                                                Verified
                                            </div>
                                        ) : (
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-800'
                                                }`}>
                                                <XCircle className="w-3 h-3" />
                                                Not Verified
                                            </div>
                                        )}
                                    </div>
                                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Student ID: #{student.sid}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h5 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Contact Information
                                </h5>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                                        }`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Mail className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'
                                                }`} />
                                            <span className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Email
                                            </span>
                                        </div>
                                        <p className={`text-sm break-all ${isDark ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {student.email}
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                                        }`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Phone className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'
                                                }`} />
                                            <span className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Contact
                                            </span>
                                        </div>
                                        <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {student.contact || 'Not provided'}
                                        </p>
                                    </div>

                                    {student.address && (
                                        <div className={`p-4 rounded-lg border md:col-span-2 ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                                            }`}>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <MapPin className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'
                                                    }`} />
                                                <span className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Address
                                                </span>
                                            </div>
                                            <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                {student.address}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="space-y-4">
                                <h5 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Account Information
                                </h5>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                                        }`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Calendar className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'
                                                }`} />
                                            <span className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Member Since
                                            </span>
                                        </div>
                                        <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {formatDate(student.created_at)}
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                                        }`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <User className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'
                                                }`} />
                                            <span className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Verified By
                                            </span>
                                        </div>
                                        <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {student.lid ? `Librarian ID: ${student.lid}` : 'Not verified'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div className={`p-4 rounded-lg border ${student.lid
                                ? isDark
                                    ? 'bg-green-900/20 border-green-800'
                                    : 'bg-green-50 border-green-200'
                                : isDark
                                    ? 'bg-yellow-900/20 border-yellow-800'
                                    : 'bg-yellow-50 border-yellow-200'
                                }`}>
                                <h5 className={`font-semibold mb-2 ${student.lid
                                    ? isDark ? 'text-green-400' : 'text-green-800'
                                    : isDark ? 'text-yellow-400' : 'text-yellow-800'
                                    }`}>
                                    Account Status
                                </h5>
                                <p className={`text-sm ${student.lid
                                    ? isDark ? 'text-green-300' : 'text-green-700'
                                    : isDark ? 'text-yellow-300' : 'text-yellow-700'
                                    }`}>
                                    {student.lid
                                        ? 'This student account has been verified by a librarian and can access all library services.'
                                        : 'This student account is pending verification. Some services may be limited until verification is complete.'
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}