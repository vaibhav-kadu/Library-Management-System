import React, { useState, useEffect } from 'react';
import { Book, User, Hash, Building, Tag, Copy, Image, X, RotateCcw, Save } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';

export default function AddBook() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const initialFormData = {
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category_id: '',
    total_copies: '',
    issued_copies: 0,
    image: null
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/addCategory');
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = (data) => {
    if (!data.title.trim()) return "Book title is required";
    if (!data.author.trim()) return "Author name is required";
    if (!data.isbn.trim()) return "ISBN is required";
    if (!data.publisher.trim()) return "Publisher is required";
    if (!data.category_id) return "Please select a category";
    if (!data.total_copies || data.total_copies <= 0) return "Total copies must be greater than 0";
    
    // ISBN validation (basic check for 10 or 13 digits)
    const isbnRegex = /^(?:\d{10}|\d{13})$/;
    const cleanIsbn = data.isbn.replace(/[-\s]/g, '');
    if (!isbnRegex.test(cleanIsbn)) return "ISBN must be 10 or 13 digits";
    
    // Check if issued copies is not greater than total copies
    if (parseInt(data.issued_copies) > parseInt(data.total_copies)) {
      return "Issued copies cannot be greater than total copies";
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
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post('http://localhost:3000/addBook', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess('Book added successfully!');
        // Reset form after successful submission
        setFormData(initialFormData);
        setImagePreview(null);
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to add book. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-8 text-white ">
            <div className="text-center flex flex-row" >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors mb-4"
                    >
                    <ArrowLeft className="w-10 h-10 " />
                              </button>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500 rounded-full mb-4">
                <Book className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-6 mt-2 pt-2 pl-4 py-4">Add New Book</h1>
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

            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Book className="w-5 h-5 mr-2 text-indigo-600" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Book Title *</label>
                    <div className="relative">
                      <Book className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
                        placeholder="Enter book title"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Author *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
                        placeholder="Enter author name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">ISBN *</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) => handleInputChange('isbn', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
                        placeholder="Enter ISBN (10 or 13 digits)"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Enter 10 or 13 digit ISBN</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Publisher *</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.publisher}
                        onChange={(e) => handleInputChange('publisher', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
                        placeholder="Enter publisher name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category *</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <select
                      value={formData.category_id}
                      onChange={(e) => handleInputChange('category_id', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg appearance-none bg-white"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Inventory Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Copy className="w-5 h-5 mr-2 text-indigo-600" />
                  Inventory Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Total Copies *</label>
                    <div className="relative">
                      <Copy className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        value={formData.total_copies}
                        onChange={(e) => handleInputChange('total_copies', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
                        placeholder="Enter total copies"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Issued Copies</label>
                    <div className="relative">
                      <Copy className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        value={formData.issued_copies}
                        onChange={(e) => handleInputChange('issued_copies', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
                        placeholder="Currently issued copies (default: 0)"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Number of copies currently issued to students</p>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-indigo-600" />
                  Book Cover Image
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Image</label>
                    <div className="relative">
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full py-4 px-4 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Image Preview</label>
                    <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Book cover preview" 
                            className="h-28 w-auto rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <Image className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">No image selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-200">
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
                  onClick={handleReset}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Book...
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