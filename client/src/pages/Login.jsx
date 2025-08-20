import { useState } from 'react';
import { User, BookOpen, Shield, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [activeTab, setActiveTab] = useState('student');
  const [showPassword, setShowPassword] = useState({ student: false, librarian: false, admin: false  });
  const [error, setError]=useState(null)
  const {login} = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    student: { email: '', password: '' },
    librarian: { email: '', password: '' },
    admin: { email: '', password: '' }
  });

  const handleInputChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  const togglePasswordVisibility = (tab) => {
    setShowPassword(prev => ({
      ...prev,
      [tab]: !prev[tab]
    }));
  };

  const handleSubmit = async (e, userType) => {
    e.preventDefault();
    try{
      console.log(`${userType} login attempt:`, formData[userType]);
      const custApi = (userType==='student') ? 'loginStudent' : (userType==='librarian') ? 'loginLibrarian' : 'loginAdmin' ; 
      const response = await axios.post(`http://localhost:3000/${custApi}`,{formData});
      if(response.data.success){
        
        login(response.data.user)
        localStorage.setItem("token",response.data.token)
        if (response.data.user.role==="student") {
          navigate('/student-dashboard')
        } else if (response.data.user.role==="librarian") {
          navigate('/librarian-dashboard')
        } else if (response.data.user.role==="admin") {
          navigate('/admin-dashboard')
        }
      }
    }catch(error){
      console.log(error);
      
      if(error.response && ! error.response.data.success){
          setError(error.response.data.error)
      }else{
        setError("Server Error");
      }
    }
    
  };

  const getTabClasses = (tabId) => {
    const baseClasses = "flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all duration-200 flex-1 justify-center border-b-2";
    
    if (activeTab === tabId) {
      if (tabId === 'student') return `${baseClasses} bg-white text-blue-600 border-blue-500 shadow-sm`;
      if (tabId === 'librarian') return `${baseClasses} bg-white text-green-600 border-green-500 shadow-sm`;
      if (tabId === 'admin') return `${baseClasses} bg-white text-purple-600 border-purple-500 shadow-sm`;
    }
    return `${baseClasses} bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent`;
  };

  const getButtonClasses = (tabId) => {
    const baseClasses = "w-full text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105";
    
    if (tabId === 'student') return `${baseClasses} bg-blue-600 hover:bg-blue-700`;
    if (tabId === 'librarian') return `${baseClasses} bg-green-600 hover:bg-green-700`;
    if (tabId === 'admin') return `${baseClasses} bg-purple-600 hover:bg-purple-700`;
    return baseClasses;
  };

  const getIconBgClasses = (tabId) => {
    if (tabId === 'student') return "bg-blue-100";
    if (tabId === 'librarian') return "bg-green-100";
    if (tabId === 'admin') return "bg-purple-100";
    return "bg-gray-100";
  };

  const getIconClasses = (tabId) => {
    if (tabId === 'student') return "text-blue-600";
    if (tabId === 'librarian') return "text-green-600";
    if (tabId === 'admin') return "text-purple-600";
    return "text-gray-600";
  };

  const getLinkClasses = (tabId) => {
    if (tabId === 'student') return "text-blue-600 hover:text-blue-500";
    if (tabId === 'librarian') return "text-green-600 hover:text-green-500";
    if (tabId === 'admin') return "text-purple-600 hover:text-purple-500";
    return "text-gray-600";
  };

  const getCheckboxClasses = (tabId) => {
    const baseClasses = "h-4 w-4 border-gray-300 rounded focus:ring-2";
    if (tabId === 'student') return `${baseClasses} text-blue-600 focus:ring-blue-500`;
    if (tabId === 'librarian') return `${baseClasses} text-green-600 focus:ring-green-500`;
    if (tabId === 'admin') return `${baseClasses} text-purple-600 focus:ring-purple-500`;
    return baseClasses;
  };

  const renderForm = (userType, title) => {
    const data = formData[userType];

    return (
      <div className={`${activeTab === userType ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'} transition-all duration-300`}>
        
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${getIconBgClasses(userType)} rounded-full mb-4`}>
            {userType === 'student' && <User className={`w-8 h-8 ${getIconClasses(userType)}`} />}
            {userType === 'librarian' && <BookOpen className={`w-8 h-8 ${getIconClasses(userType)}`} />}
            {userType === 'admin' && <Shield className={`w-8 h-8 ${getIconClasses(userType)}`} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title} Login</h2>
          <p className="text-gray-600 mt-2">Please sign in to your account</p>
        </div>

        <div className="space-y-6">
          {error && <p className='text-red-500'>{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
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
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword[userType] ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className={getCheckboxClasses(userType)}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className={`text-sm ${getLinkClasses(userType)} transition-colors`}>
              Forgot password?
            </a>
          </div>

          <button
            onClick={(e) => handleSubmit(e, userType)}
            className={getButtonClasses(userType)}
          >
            Sign In as {title}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? <a href="#" className={`${getLinkClasses(userType)} transition-colors`}>Contact Support</a>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Tab Navigation */}
        <div className="bg-gray-200 rounded-t-xl p-1 mb-0">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('student')}
              className={getTabClasses('student')}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Student</span>
            </button>
            
            <button
              onClick={() => setActiveTab('librarian')}
              className={getTabClasses('librarian')}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Librarian</span>
            </button>
            
            <button
              onClick={() => setActiveTab('admin')}
              className={getTabClasses('admin')}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-b-xl shadow-xl p-8 border-t-0">
          {renderForm('student', 'Student')}
          {renderForm('librarian', 'Librarian')}
          {renderForm('admin', 'Admin')}
        </div>
      </div>
    </div>
  );
}