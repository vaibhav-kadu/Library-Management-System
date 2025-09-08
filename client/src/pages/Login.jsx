import React, { useState } from 'react';
import { User, BookOpen, Shield, Eye, EyeOff, Mail, Lock, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function Login({ onClose, theme }) {
  const [activeTab, setActiveTab] = useState('student');
  const [showPassword, setShowPassword] = useState({ student: false, librarian: false, admin: false });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student: { 
      email: '', 
      password: ''
    },
    librarian: { 
      email: '', 
      password: ''
    },
    admin: { 
      email: '', 
      password: ''
    }
  });

  // Handle input changes
  const handleInputChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (tab) => {
    setShowPassword(prev => ({
      ...prev,
      [tab]: !prev[tab]
    }));
  };

  // Submit login request
  const handleSubmit = async (e, userType) => {
    e.preventDefault();
    const credentials = formData[userType];

    // Login validation
    if (!credentials.email || !credentials.password) {
      setError("Please fill in both email and password");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const apiEndpoint = userType === 'student' ? 'loginStudent' :
                         userType === 'librarian' ? 'loginLibrarian' : 'loginAdmin';

      const response = await axios.post(`http://localhost:3000/${apiEndpoint}`, credentials);

      if (response.data.success) {
        login(response.data.user);
        // Note: Save Token In LocalStorage 
        localStorage.setItem("token", response.data.token);

        const role = response.data.user?.role;

        // Note: Save Role In LocalStorage 
        localStorage.setItem("role", role);
        
        if (role === "student") navigate('/student-dashboard');
        else if (role === "librarian") {
          
        const lid = response.data.user?.lid;
        localStorage.setItem("lid", lid);
          navigate('/librarian-dashboard');
        }
        else if (role === "admin") navigate('/admin-dashboard');
        else navigate('/');
        
        if (onClose) onClose();
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "Server Error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic styling helpers
  const tabColors = {
    student: 'blue',
    librarian: 'green',
    admin: 'purple',
  };

  const getTabClasses = (tabId) => {
    const base = "flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all duration-200 flex-1 justify-center border-b-2 font-medium";
    const color = tabColors[tabId];
    if (activeTab === tabId) {
      return `${base} ${
        theme === 'dark' 
          ? `bg-gray-700 text-${color}-400 border-${color}-500`
          : `bg-white text-${color}-600 border-${color}-500`
      } shadow-sm`;
    }
    return `${base} ${
      theme === 'dark'
        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
    } border-transparent`;
  };

  const getButtonClasses = (tabId) => {
    const color = tabColors[tabId];
    return `w-full text-white py-3 rounded-lg font-medium transition duration-200 bg-${color}-600 hover:bg-${color}-700 disabled:opacity-50 disabled:cursor-not-allowed`;
  };

  const getInputClasses = () => {
    return `w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
      theme === 'dark'
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`;
  };

  const renderForm = (userType, title) => {
    const data = formData[userType];

    return (
      <form
        onSubmit={(e) => handleSubmit(e, userType)}
        className={`${activeTab === userType ? 'block' : 'hidden'}`}
      >
        {error && (
          <div className={`mb-4 text-sm p-3 rounded-lg border ${
            theme === 'dark'
              ? 'text-red-400 bg-red-900/20 border-red-800'
              : 'text-red-700 bg-red-50 border-red-200'
          }`}>
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="mb-4 relative">
          <Mail className={`absolute left-3 top-3.5 h-5 w-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleInputChange(userType, 'email', e.target.value)}
            className={getInputClasses()}
            placeholder="Email"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <Lock className={`absolute left-3 top-3.5 h-5 w-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type={showPassword[userType] ? 'text' : 'password'}
            value={data.password}
            onChange={(e) => handleInputChange(userType, 'password', e.target.value)}
            className={getInputClasses()}
            placeholder="Password"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(userType)}
            className={`absolute right-3 top-3.5 ${
              theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {showPassword[userType] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => alert('Forgot password flow not implemented')}
            className={`text-sm hover:underline ${
              theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={getButtonClasses(userType)}
          disabled={submitting}
        >
          {submitting 
            ? "Signing In..." 
            : `Sign In as ${title}`
          }
        </button>

       
      </form>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className={`relative rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors duration-200 ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <h2 className={`text-2xl font-bold text-center mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Back
          </h2>
          <p className={`text-center mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Sign in to your account
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className={`rounded-lg p-1 flex space-x-1 mb-6 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <button onClick={() => setActiveTab('student')} className={getTabClasses('student')}>
              <User className="w-4 h-4" />
              <span className="text-sm">Student</span>
            </button>
            <button onClick={() => setActiveTab('librarian')} className={getTabClasses('librarian')}>
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Librarian</span>
            </button>
            <button onClick={() => setActiveTab('admin')} className={getTabClasses('admin')}>
              <Shield className="w-4 h-4" />
              <span className="text-sm">Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          {renderForm('student', 'Student')}
          {renderForm('librarian', 'Librarian')}
          {renderForm('admin', 'Admin')}
        </div>
      </div>
    </div>
  );
}