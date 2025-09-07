import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, UserCircle } from 'lucide-react';

export default function StudentProfile({ student, onClose, theme = 'light' }) {
  if (!student) return null;

  const isDark = theme === 'dark';
  const isVerified = student.lid != null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className={`relative rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Profile Image */}
        <div className={`px-6 py-8 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex flex-col items-center text-center">
            {/* Profile Image */}
            <div className="relative mb-4">
              {student.profileImage ? (
                <img
                  src={`http://localhost:3000/student_images/${student.profileImage}?${Date.now()}`}
                  alt={student.name}
                  className={`w-24 h-24 rounded-full object-cover border-4 shadow-lg ${
                    isDark ? 'border-gray-600' : 'border-gray-200'
                  }`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-lg ${
                student.profileImage ? 'hidden' : 'flex'
              } ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                <UserCircle className={`w-16 h-16 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>

              {/* Verification Status Badge */}
              <div className={`absolute -bottom-2 -right-2 p-2 rounded-full ${
                isVerified 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}>
                {isVerified ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <XCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>

            {/* Name and Status */}
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {student.name}
            </h2>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isVerified
                ? isDark 
                  ? 'bg-green-900/20 text-green-400 border border-green-800'
                  : 'bg-green-100 text-green-700 border border-green-200'
                : isDark
                  ? 'bg-red-900/20 text-red-400 border border-red-800'
                  : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {isVerified ? 'Verified Student' : 'Unverified Student'}
            </div>
          </div>
        </div>

        {/* Student Details */}
        <div className="p-6 space-y-6">
          <div className="grid gap-4">
            {/* Email */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-blue-600/20' : 'bg-blue-100'
              }`}>
                <Mail className={`w-5 h-5 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Email Address
                </p>
                <p className={`text-base ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {student.email}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-green-600/20' : 'bg-green-100'
              }`}>
                <Phone className={`w-5 h-5 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Contact Number
                </p>
                <p className={`text-base ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {student.contact || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Address */}
            {student.address && (
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-purple-600/20' : 'bg-purple-100'
                }`}>
                  <MapPin className={`w-5 h-5 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Address
                  </p>
                  <p className={`text-base ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {student.address}
                  </p>
                </div>
              </div>
            )}

            {/* Student ID */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-orange-600/20' : 'bg-orange-100'
              }`}>
                <User className={`w-5 h-5 ${
                  isDark ? 'text-orange-400' : 'text-orange-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Student ID
                </p>
                <p className={`text-base ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {student.sid || student.id}
                </p>
              </div>
            </div>

            {/* Registration Date */}
            {student.created_at && (
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-indigo-600/20' : 'bg-indigo-100'
                }`}>
                  <Calendar className={`w-5 h-5 ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Registration Date
                  </p>
                  <p className={`text-base ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {new Date(student.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info Section */}
          {isVerified && (
            <div className={`rounded-lg p-4 ${
              isDark 
                ? 'bg-green-900/10 border border-green-800'
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`w-5 h-5 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <p className={`text-sm font-medium ${
                  isDark ? 'text-green-400' : 'text-green-700'
                }`}>
                  This student has been verified by a librarian
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-md font-medium transition duration-200 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}