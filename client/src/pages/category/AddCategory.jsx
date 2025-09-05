import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tag, X, Save } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddCategory({ onClose, theme = 'light' }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const initialFormData = { name: '' };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (data) => {
    if (!data.name.trim()) return "Category name is required";
    if (data.name.trim().length < 2) return "Category name must be at least 2 characters long";
    if (data.name.trim().length > 50) return "Category name must be less than 50 characters";
    const nameRegex = /^[a-zA-Z0-9\s\-_&]+$/;
    if (!nameRegex.test(data.name.trim())) {
      return "Category name can only contain letters, numbers, spaces, hyphens, underscores, and ampersands";
    }
    return null;
  };

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
      const response = await axios.post('http://localhost:3000/addCategory', {
        name: formData.name.trim()
      });

      if (response.data.success) {
        setSuccess('Category added successfully!');
        setFormData(initialFormData);

        // Close modal after 2 sec
        setTimeout(() => {
          setSuccess(null);
          if (onClose) onClose();
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "Failed to add category. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.name.trim() !== '') {
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
    return `w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
      theme === 'dark'
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`;
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      ></div>

      {/* Modal */}
      <div
        className={`relative z-[10000] rounded-2xl shadow-2xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className={`absolute top-4 right-4 z-[10001] p-2 rounded-full transition-colors duration-200 ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-0 text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              theme === 'dark' ? 'bg-purple-600' : 'bg-purple-100'
            }`}
          >
            <Tag className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-purple-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Add New Category
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Create a new book category
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className={`mb-4 text-sm p-3 rounded-lg border ${
                theme === 'dark'
                  ? 'text-red-400 bg-red-900/20 border-red-800'
                  : 'text-red-700 bg-red-50 border-red-200'
              }`}>
                {error}
              </div>
            )}

            {success && (
              <div className={`mb-4 text-sm p-3 rounded-lg border ${
                theme === 'dark'
                  ? 'text-green-400 bg-green-900/20 border-green-800'
                  : 'text-green-700 bg-green-50 border-green-200'
              }`}>
                {success}
              </div>
            )}

            <div className="mb-4 relative">
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Category Name *
              </label>
              <Tag className="absolute left-3 top-11 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={getInputClasses()}
                placeholder="Enter category name (e.g., Fiction, Science)"
                maxLength={50}
                required
              />
              <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>Minimum 2 characters</span>
                <span>{formData.name.length}/50</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="submit"
                disabled={submitting || !formData.name.trim()}
                className="w-full text-white py-3 rounded-lg font-medium transition duration-200 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <span className="flex items-center animate-spin">Adding Category...</span>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Add Category
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className={`w-full py-3 rounded-lg font-medium transition duration-200 border ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
