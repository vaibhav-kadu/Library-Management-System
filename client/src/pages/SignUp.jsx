import React, { useState } from 'react';
import { User, BookOpen, Eye, EyeOff, Mail, Lock, X, UserPlus, Phone, Calendar, MapPin, Upload, Camera } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_URL;

export default function SignUp({ onClose, theme }) {
  const [activeTab, setActiveTab] = useState('student');
  const [showPassword, setShowPassword] = useState({ student: false, librarian: false });
  const [showConfirmPassword, setShowConfirmPassword] = useState({ student: false, librarian: false });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [profileImages, setProfileImages] = useState({ student: null, librarian: null });
  const [imagePreview, setImagePreview] = useState({ student: null, librarian: null });

  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student: { 
      email: '', 
      password: '',
      confirmPassword: '',
      name: '',
      contact: '',
      address: '',
    },
    librarian: { 
      email: '', 
      password: '',
      confirmPassword: '',
      name: '',
      contact: '',
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

  // Handle profile image upload
  const handleImageUpload = (tab, file) => {
    if (file && file.type.startsWith('image/')) {
      setProfileImages(prev => ({
        ...prev,
        [tab]: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => ({
          ...prev,
          [tab]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (tab, field = 'password') => {
    if (field === 'confirmPassword') {
      setShowConfirmPassword(prev => ({
        ...prev,
        [tab]: !prev[tab]
      }));
    } else {
      setShowPassword(prev => ({
        ...prev,
        [tab]: !prev[tab]
      }));
    }
  };

  // Submit signup request
  const handleSubmit = async (e, userType) => {
    e.preventDefault();
    const credentials = formData[userType];

    // Signup validation
    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (!credentials.name || !credentials.email || !credentials.contact) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const apiEndpoint = userType === 'student' ? 'addStudent' : 'addLibrarian';
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.keys(credentials).forEach(key => {
        formDataToSend.append(key, credentials[key]);
      });
      
      if (profileImages[userType]) {
        formDataToSend.append('profileImage', profileImages[userType]);
      }

      const response = await api.post(`/${apiEndpoint}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        
        alert(response.data.message+"\n Login Now");  
        navigate('/login');
        
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
  };

  const getTabClasses = (tabId) => {
    const base = "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 font-medium text-sm";
    const color = tabColors[tabId];
    if (activeTab === tabId) {
      return `${base} ${
        theme === 'dark' 
          ? `bg-${color}-600 text-white`
          : `bg-${color}-500 text-white`
      }`;
    }
    return `${base} ${
      theme === 'dark'
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;
  };

  const getButtonClasses = (tabId) => {
    const color = tabColors[tabId];
    return `w-full text-white py-2.5 rounded-md font-medium transition duration-200 bg-${color}-600 hover:bg-${color}-700 disabled:opacity-50 disabled:cursor-not-allowed`;
  };

  const getInputClasses = () => {
    return `w-full pl-10 pr-4 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
      theme === 'dark'
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`;
  };

  const renderProfileImageUpload = (userType) => {
    return (
      <div className="mb-4 text-center">
        <div className={`relative inline-block ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        } rounded-full p-1`}>
          {imagePreview[userType] ? (
            <img
              src={imagePreview[userType]}
              alt="Profile preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <User className={`w-8 h-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
              }`} />
            </div>
          )}
          
          <label className={`absolute bottom-0 right-0 ${
            theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-full p-1.5 cursor-pointer transition-colors duration-200`}>
            <Camera className="w-3 h-3" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(userType, e.target.files[0])}
            />
          </label>
        </div>
        <p className={`mt-2 text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Choose profile image
        </p>
      </div>
    );
  };

  const renderSignUpFields = (userType) => {
    const data = formData[userType];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Image Upload - Full Width */}
        <div className="md:col-span-2">
          {renderProfileImageUpload(userType)}
        </div>

        {/* Name */}
        <div className="relative md:col-span-2">
          <User className={`absolute left-3 top-3 h-4 w-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleInputChange(userType, 'name', e.target.value)}
            className={getInputClasses()}
            placeholder="Full Name"
            required
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <Mail className={`absolute left-3 top-3 h-4 w-4 ${
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

        {/* Phone */}
        <div className="relative">
          <Phone className={`absolute left-3 top-3 h-4 w-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="tel"
            value={data.contact}
            onChange={(e) => handleInputChange(userType, 'contact', e.target.value)}
            className={getInputClasses()}
            placeholder="Phone Number"
            required
          />
        </div>

        {/* Additional fields based on user type */}
        {userType === 'student' && (
          <>
            <div className="relative md:col-span-2">
              <MapPin className={`absolute left-3 top-3 h-4 w-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={data.address}
                onChange={(e) => handleInputChange(userType, 'address', e.target.value)}
                className={getInputClasses()}
                placeholder="Address"
              />
            </div>
          </>
        )}

      
        {/* Password Input */}
        <div className="relative">
          <Lock className={`absolute left-3 top-3 h-4 w-4 ${
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
            className={`absolute right-3 top-3 ${
              theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {showPassword[userType] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock className={`absolute left-3 top-3 h-4 w-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type={showConfirmPassword[userType] ? 'text' : 'password'}
            value={data.confirmPassword}
            onChange={(e) => handleInputChange(userType, 'confirmPassword', e.target.value)}
            className={getInputClasses()}
            placeholder="Confirm Password"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(userType, 'confirmPassword')}
            className={`absolute right-3 top-3 ${
              theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {showConfirmPassword[userType] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  };

  const renderForm = (userType, title) => {
    return (
      <form
        onSubmit={(e) => handleSubmit(e, userType)}
        className={`${activeTab === userType ? 'block' : 'hidden'}`}
      >
        {error && (
          <div className={`mb-4 text-sm p-3 rounded-md border ${
            theme === 'dark'
              ? 'text-red-400 bg-red-900/20 border-red-800'
              : 'text-red-700 bg-red-50 border-red-200'
          }`}>
            {error}
          </div>
        )}

        {/* Sign Up fields */}
        {renderSignUpFields(userType)}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className={getButtonClasses(userType)}
            disabled={submitting}
          >
            {submitting 
              ? "Creating Account..." 
              : `Create ${title} Account`
            }
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal - Full width with max constraints */}
      <div className={`relative rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
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
        <div className="p-6 pb-4">
          <h2 className={`text-2xl font-bold text-center mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Create Account
          </h2>
          <p className={`text-center mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join our library management system
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className={`rounded-md p-1 flex space-x-1 mb-6 max-w-md mx-auto ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <button onClick={() => setActiveTab('student')} className={getTabClasses('student')}>
              <User className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button onClick={() => setActiveTab('librarian')} className={getTabClasses('librarian')}>
              <BookOpen className="w-4 h-4" />
              <span>Librarian</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          {renderForm('student', 'Student')}
          {renderForm('librarian', 'Librarian')}
        </div>
      </div>
    </div>
  );
}