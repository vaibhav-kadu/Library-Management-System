import React, { useState, useEffect } from 'react';
import { User, Eye, EyeOff, Mail, Lock, X, Phone, MapPin, Camera, Save, Edit2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddStudent({ onClose, theme = 'light', editingStudent = null, onUpdateSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const isEditing = Boolean(editingStudent);

  const initialFormData = {
    email: '', 
    password: '',
    confirmPassword: '',
    name: '',
    contact: '',
    address: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Populate form data when editing
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        email: editingStudent.email || '',
        password: '', // Keep password empty for security
        confirmPassword: '',
        name: editingStudent.name || '',
        contact: editingStudent.contact || '',
        address: editingStudent.address || '',
      });

      // Set existing profile image preview
      if (editingStudent.profileImage) {
        setImagePreview(`http://localhost:3000/student_images/${editingStudent.profileImage}?${Date.now()}`);
      }
    }
  }, [editingStudent]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field = 'password') => {
    if (field === 'confirmPassword') {
      setShowConfirmPassword(prev => !prev);
    } else {
      setShowPassword(prev => !prev);
    }
  };

  // Validation
  const validateForm = (data) => {
    if (!data.name.trim()) return "Name is required";
    if (!data.email.trim()) return "Email is required";
    if (!data.contact.trim()) return "Contact number is required";
    
    // For new student, password is required
    if (!isEditing) {
      if (!data.password) return "Password is required";
      if (data.password.length < 6) return "Password must be at least 6 characters long";
      if (data.password !== data.confirmPassword) return "Passwords don't match";
    } else {
      // For editing, password is optional, but if provided, must match confirmation
      if (data.password && data.password.length < 6) return "Password must be at least 6 characters long";
      if (data.password && data.password !== data.confirmPassword) return "Passwords don't match";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) return "Please enter a valid email address";
    
    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(data.contact.replace(/\s|-|\(|\)/g, ''))) {
      return "Please enter a valid phone number";
    }
    
    return null;
  };

  // Submit request (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      if (isEditing) {
        // For updating
        const studentId = editingStudent.sid || editingStudent.id;
        formDataToSend.append('id', studentId);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('contact', formData.contact);
        formDataToSend.append('address', formData.address);
        
        // Only append password if it's provided
        if (formData.password) {
          formDataToSend.append('password', formData.password);
        }

        // Add current profile image name for reference
        if (editingStudent.profileImage) {
          formDataToSend.append('currentProfileImage', editingStudent.profileImage);
        }

        // Add new image if selected
        if (profileImage) {
          formDataToSend.append('profileImage', profileImage);
        }
        console.log("I am Here");

        const response = await axios.put('http://localhost:3000/updateStudent', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("I am Here");

        if (response.data.message === "Update Successfully") {
          setSuccess('Student updated successfully!');
          
          // Show success message and close modal after delay
          setTimeout(() => {
            alert('Student updated successfully!');
            if (onUpdateSuccess) {
              onUpdateSuccess();
            } else if (onClose) {
              onClose();
            }
          }, 1000);
        }
      } else {
        // For creating new student
        Object.keys(formData).forEach(key => {
          if (key !== 'confirmPassword') {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        if (profileImage) {
          formDataToSend.append('profileImage', profileImage);
        }

        const response = await axios.post('http://localhost:3000/addStudent', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          setSuccess('Student account created successfully!');
          
          // Reset form after successful submission
          setFormData(initialFormData);
          setProfileImage(null);
          setImagePreview(null);
          
          setTimeout(() => {
            setSuccess(null);
            if (onClose) onClose();
          }, 2000);
        }
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || error.response?.data?.message || "Server Error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = Object.values(formData).some(value => value.trim() !== '') || profileImage;
    
    if (hasChanges) {
      if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        if (onClose) onClose();
        else navigate(-1);
      }
    } else {
      if (onClose) onClose();
      else navigate(-1);
    }
  };

  const getInputClasses = () => {
    return `w-full pl-10 pr-4 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
      theme === 'dark'
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`;
  };

  const renderProfileImageUpload = () => {
    return (
      <div className="mb-4 text-center">
        <div className={`relative inline-block ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        } rounded-full p-1`}>
          {imagePreview ? (
            <img
              src={imagePreview}
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
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
          </label>
        </div>
        <p className={`mt-2 text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Choose profile image (optional)
        </p>
      </div>
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
          onClick={handleCancel}
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
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              theme === 'dark' ? 'bg-blue-600/90' : 'bg-blue-100/90'
            }`}>
              {isEditing ? (
                <Edit2 className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-white' : 'text-blue-600'
                }`} />
              ) : (
                <User className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-white' : 'text-blue-600'
                }`} />
              )}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isEditing ? 'Update Student' : 'Add New Student'}
            </h2>
            <p className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {isEditing ? 'Update student information' : 'Create a new student account'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className={`text-sm p-3 rounded-md border ${
                theme === 'dark'
                  ? 'text-red-400 bg-red-900/20 border-red-800'
                  : 'text-red-700 bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className={`text-sm p-3 rounded-md border ${
                theme === 'dark'
                  ? 'text-green-400 bg-green-900/20 border-green-800'
                  : 'text-green-700 bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">{success}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile Image Upload - Full Width */}
              <div className="md:col-span-2">
                {renderProfileImageUpload()}
              </div>

              {/* Full Name */}
              <div className="md:col-span-2 relative">
                <User className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Full Name"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Phone Number"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2 relative">
                <MapPin className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Address (optional)"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={getInputClasses()}
                  placeholder={isEditing ? "New Password (leave blank to keep current)" : "Password"}
                  required={!isEditing}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility()}
                  className={`absolute right-3 top-3 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={getInputClasses()}
                  placeholder={isEditing ? "Confirm New Password" : "Confirm Password"}
                  required={!isEditing ? true : formData.password.length > 0}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className={`absolute right-3 top-3 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full text-white py-2.5 rounded-md font-medium transition duration-200 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Creating Account...'}
                  </span>
                ) : (
                  <>
                    {isEditing ? <Edit2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Update Student' : 'Create Student Account'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className={`w-full py-2.5 rounded-md font-medium transition duration-200 border ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}