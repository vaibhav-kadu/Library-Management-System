import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Edit3, Save, X, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminProfile({ theme }) {
  const { user } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/getAdminById`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.success) {
        const adminData = response.data.admin;
        setAdmin(adminData);
        setFormData({
          name: adminData.name || '',
          email: adminData.email || '',
          contact: adminData.contact || '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setError('Failed to fetch admin data');
      console.error('Error fetching admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.contact.trim()) {
      setError('Contact is required');
      return false;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('contact', formData.contact);
      
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      
      if (profileImageFile) {
        formDataToSend.append('profileImage', profileImageFile);
      }

      const response = await api.put(`/updateAdmin`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setEditing(false);
        setProfileImageFile(null);
        setPreviewImage(null);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        await fetchAdminData();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
      console.error('Error updating admin:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setProfileImageFile(null);
    setPreviewImage(null);
    setError(null);
    setSuccess(null);
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        contact: admin.contact || '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <h2 className="text-2xl font-bold mb-4">Admin Not Found</h2>
          <p>Unable to load admin profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-2xl shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : admin.profileImage ? (
                    <img 
                      src={`${BASE_URL}/admin_images/${admin.profileImage}?${Date.now()}`} 
                      alt={admin.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center ${admin.profileImage && !previewImage ? 'hidden' : 'flex'}`}>
                    <span className="text-3xl font-bold text-white">
                      {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                </div>
                
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{admin.name}</h1>
                <p className="text-purple-100 text-lg">Administrator</p>
                <p className="text-purple-200 text-sm mt-2">
                  Member since {new Date(admin.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Action Buttons */}
            <div className="flex justify-end mb-6">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Edit3 className="h-5 w-5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <X className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-5 w-5" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                theme === 'dark' 
                  ? 'bg-red-900/20 border-red-500 text-red-300' 
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}>
                {error}
              </div>
            )}

            {success && (
              <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                theme === 'dark' 
                  ? 'bg-green-900/20 border-green-500 text-green-300' 
                  : 'bg-green-50 border-green-500 text-green-700'
              }`}>
                {success}
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                        editing
                          ? theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                          : theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-gray-300'
                            : 'bg-gray-100 border-gray-200 text-gray-700'
                      } focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                        editing
                          ? theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                          : theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-gray-300'
                            : 'bg-gray-100 border-gray-200 text-gray-700'
                      } focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                        editing
                          ? theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                          : theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-gray-300'
                            : 'bg-gray-100 border-gray-200 text-gray-700'
                      } focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* ID */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Admin ID
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={admin.id}
                      disabled
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-gray-400'
                          : 'bg-gray-100 border-gray-200 text-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Password Section (only when editing) */}
              {editing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      New Password (optional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-4 pr-10 py-3 rounded-lg border transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        } focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                        placeholder="Leave blank to keep current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Account Created
                  </label>
                  <input
                    type="text"
                    value={new Date(admin.created_at).toLocaleString()}
                    disabled
                    className={`w-full px-4 py-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-gray-400'
                        : 'bg-gray-100 border-gray-200 text-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Last Updated
                  </label>
                  <input
                    type="text"
                    value={new Date(admin.updated_at).toLocaleString()}
                    disabled
                    className={`w-full px-4 py-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-gray-400'
                        : 'bg-gray-100 border-gray-200 text-gray-500'
                    }`}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}