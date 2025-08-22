import React, { useState, useEffect } from 'react';
import { User, BookOpen, Eye, EyeOff, Mail, Lock, Phone, MapPin, Users } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

export default function AddStudents() {
  const [activeTab, setActiveTab] = useState('student');
  const [showPassword, setShowPassword] = useState({ student: false, librarian: false });
  const [showConfirmPassword, setShowConfirmPassword] = useState({ student: false, librarian: false });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [librarians, setLibrarians] = useState([]); // For librarian dropdown
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student: {
      name: '',
      email: '',
      contact: '',
      address: '',
      password: '',
      confirmPassword: '',
      librarian_id: ''
    },
    librarian: {
      name: '',
      email: '',
      contact: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Fetch librarians for student registration
  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        const response = await axios.get('http://localhost:3000/librarians');
        if (response.data.success) {
          setLibrarians(response.data.librarians);
        }
      } catch (error) {
        console.error('Error fetching librarians:', error);
      }
    };
    
    if (activeTab === 'student') {
      fetchLibrarians();
    }
  }, [activeTab]);

  const handleInputChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

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

  const validateForm = (userType, data) => {
    // Basic validation
    if (!data.name.trim()) return "Name is required";
    if (!data.email.trim()) return "Email is required";
    if (!data.contact.trim()) return "Contact is required";
    if (!data.password) return "Password is required";
    if (!data.confirmPassword) return "Please confirm your password";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) return "Please enter a valid email";
    
    // Contact validation (assuming 10 digit phone number)
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(data.contact)) return "Contact must be 10 digits";
    
    // Password validation
    if (data.password.length < 6) return "Password must be at least 6 characters";
    if (data.password !== data.confirmPassword) return "Passwords do not match";
    
    // Student specific validation
    if (userType === 'student') {
      if (!data.address.trim()) return "Address is required";
      if (!data.librarian_id) return "Please select a librarian";
    }
    
    return null;
  };

  const handleSubmit = async (e, userType) => {
    e.preventDefault();
    const data = formData[userType];
    
    // Validate form
    const validationError = validateForm(userType, data);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = userType === 'student' ? 'registerStudent' : 'registerLibrarian';
      
      // Prepare payload (exclude confirmPassword)
      const payload = { ...data };
      delete payload.confirmPassword;

      const response = await axios.post(`http://localhost:3000/${endpoint}`, payload);

      if (response.data.success) {
        setSuccess(`${userType.charAt(0).toUpperCase() + userType.slice(1)} registered successfully!`);
        
        // Reset form
        setFormData(prev => ({
          ...prev,
          [userType]: userType === 'student' ? {
            name: '', email: '', contact: '', address: '', password: '', confirmPassword: '', librarian_id: ''
          } : {
            name: '', email: '', contact: '', password: '', confirmPassword: ''
          }
        }));

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Utility classes (same pattern as login)
  const getTabClasses = (tabId) => {
    const base = "flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all duration-200 flex-1 justify-center border-b-2";
    if (activeTab === tabId) {
      return `${base} bg-white text-${tabId}-600 border-${tabId}-500 shadow-sm`.replace('student', 'blue').replace('librarian', 'green');
    }
    return `${base} bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent`;
  };

  const getButtonClasses = (tabId) => {
    const base = "w-full text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105";
    const colorMap = {
      student: "bg-blue-600 hover:bg-blue-700",
      librarian: "bg-green-600 hover:bg-green-700"
    };
    return `${base} ${colorMap[tabId] || "bg-gray-600 hover:bg-gray-700"}`;
  };

  const getIconBgClasses = (tabId) => {
    const color = tabId === 'student' ? 'blue' : 'green';
    return `bg-${color}-100`;
  };

  const getIconClasses = (tabId) => {
    const color = tabId === 'student' ? 'blue' : 'green';
    return `text-${color}-600`;
  };

  const getLinkClasses = (tabId) => {
    const color = tabId === 'student' ? 'blue' : 'green';
    return `text-${color}-600 hover:text-${color}-500`;
  };

  const renderForm = (userType, title) => {
    const data = formData[userType];

    return (
      <div className={`${activeTab === userType ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'} transition-all duration-300`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${getIconBgClasses(userType)} rounded-full mb-4`}>
            {userType === 'student' && <User className={`w-8 h-8 ${getIconClasses(userType)}`} />}
            {userType === 'librarian' && <BookOpen className={`w-8 h-8 ${getIconClasses(userType)}`} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title} Registration</h2>
          <p className="text-gray-600 mt-2">Create your account to get started</p>
        </div>

        <div className="space-y-6">
          {error && <div className="text-red-700 bg-red-100 p-3 rounded-lg">{error}</div>}
          {success && <div className="text-green-700 bg-green-100 p-3 rounded-lg">{success}</div>}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleInputChange(userType, 'name', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange(userType, 'email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Contact Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={data.contact}
                onChange={(e) => handleInputChange(userType, 'contact', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
              />
            </div>
          </div>

          {/* Address Field (Only for Students) */}
          {userType === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  value={data.address}
                  onChange={(e) => handleInputChange(userType, 'address', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Enter your address"
                  rows="3"
                  required
                />
              </div>
            </div>
          )}

          {/* Librarian Selection (Only for Students) */}
          {userType === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Librarian</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={data.librarian_id}
                  onChange={(e) => handleInputChange(userType, 'librarian_id', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                  required
                >
                  <option value="">Select a librarian</option>
                  {librarians.map((librarian) => (
                    <option key={librarian.id} value={librarian.id}>
                      {librarian.name} - {librarian.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword[userType] ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => handleInputChange(userType, 'password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(userType)}
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                {showPassword[userType] ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword[userType] ? 'text' : 'password'}
                value={data.confirmPassword}
                onChange={(e) => handleInputChange(userType, 'confirmPassword', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(userType, 'confirmPassword')}
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword[userType] ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            onClick={(e) => handleSubmit(e, userType)}
            className={getButtonClasses(userType)}
            disabled={submitting}
          >
            {submitting ? "Creating Account..." : `Create ${title} Account`}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button 
              onClick={() => navigate('/login')}
              className={`${getLinkClasses(userType)} transition-colors cursor-pointer`}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Tabs */}
        <div className="bg-gray-200 rounded-t-xl p-1 mb-0">
          <div className="flex space-x-1">
            <button onClick={() => setActiveTab('student')} className={getTabClasses('student')}>
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Student</span>
            </button>
            <button onClick={() => setActiveTab('librarian')} className={getTabClasses('librarian')}>
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Librarian</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-xl shadow-xl p-8 border-t-0">
          {renderForm('student', 'Student')}
          {renderForm('librarian', 'Librarian')}
        </div>
      </div>
    </div>
  );
}