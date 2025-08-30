import React, { useState } from 'react';
import { Tag, X, RotateCcw, Save } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddCategory() {
  const [error, setError] = useState(null);
  const [success,setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const initialFormData = {
    name: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (data) => {
    if (!data.name.trim()) return "Category name is required";
    if (data.name.trim().length < 2) return "Category name must be at least 2 characters long";
    if (data.name.trim().length > 50) return "Category name must be less than 50 characters";
    
    // Check for valid characters (letters, numbers, spaces, hyphens, underscores)
    const nameRegex = /^[a-zA-Z0-9\s\-_&]+$/;
    if (!nameRegex.test(data.name.trim())) {
      return "Category name can only contain letters, numbers, spaces, hyphens, underscores, and ampersands";
    }
    
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:3000/addCategory', {
        name: formData.name.trim()
      });

      if (response.data.message) {
        setSuccess('Category added successfully!');
        // Reset form after successful submission
        setFormData(initialFormData);
        
        // Auto-hide success message and optionally redirect
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to add category. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.name.trim() !== '') {
      if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        navigate(-1); // Go back to previous page
      }
    } else {
      navigate(-1); // Go back directly if no changes
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-8 text-white">
            <div className="text-center flex flex-row ">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full mb-2">
                <Tag className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold p-2 mb-2">    Add New Category</h1>
              </div>
            
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">{success}</div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {/* Category Information Section */}
              <div className="bg-gray-50 rounded-xl p-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Tag className="w-6 h-6 mr-3 text-emerald-600" />
                  Category Information
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Category Name *</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-5 h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg bg-white placeholder-gray-400"
                      placeholder="Enter category name (e.g., Fiction, Science, History)"
                      maxLength="50"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Minimum 2 characters, maximum 50 characters
                    </p>
                    <p className="text-sm text-gray-400">
                      {formData.name.length}/50
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !formData.name.trim()}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Category...
                    </span>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}