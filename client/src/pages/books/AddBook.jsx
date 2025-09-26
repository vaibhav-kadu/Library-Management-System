import React, { useState, useEffect } from 'react';
import { BookOpen, Camera, Save, X, User, Hash, Building, Layers, Package, Edit2 } from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_URL;

export default function AddBook({ onClose, theme = 'light', editingBook = null, onUpdateSuccess }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookImage, setBookImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const isEditing = Boolean(editingBook);

  const initialFormData = {
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category_id: '',
    total_copies: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  // Populate form data when editing
  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author || '',
        isbn: editingBook.isbn || '',
        publisher: editingBook.publisher || '',
        category_id: editingBook.category_id || '',
        total_copies: editingBook.total_copies || ''
      });

      // Set existing book image preview
      if (editingBook.bookImage && editingBook.bookImage !== 'null') {
        setImagePreview(`${BASE_URL}/book_images/${editingBook.bookImage}?${Date.now()}`);
      }
    }
  }, [editingBook]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };
    
    fetchCategories();
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle book image upload
  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }

      setBookImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Validation
  const validateForm = (data) => {
    if (!data.title.trim()) return "Book title is required";
    if (!data.author.trim()) return "Author is required";
    if (!data.isbn.trim()) return "ISBN is required";
    if (!data.publisher.trim()) return "Publisher is required";
    if (!data.category_id || data.category_id === '') return "Category is required";
    if (!data.total_copies || isNaN(data.total_copies) || data.total_copies <= 0) {
      return "Total copies must be a positive number";
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
        // For updating - Use PUT method with book_id parameter in URL
        const bookId = editingBook.book_id || editingBook.id;
        
        formDataToSend.append('title', formData.title);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('isbn', formData.isbn);
        formDataToSend.append('publisher', formData.publisher);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('total_copies', formData.total_copies);
        
        // Add current book image name for reference
        if (editingBook.bookImage && editingBook.bookImage !== 'null') {
          formDataToSend.append('currentImage', editingBook.bookImage);
        }

        // FIXED: Use correct field name 'bookImage' instead of 'book_images'
        if (bookImage) {
          formDataToSend.append('bookImage', bookImage);
        }

        // Use PUT method with book_id parameter in URL
        const response = await api.put(`/updateBook/${bookId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success && response.data.message === "Book Updated") {
          setSuccess('Book updated successfully!');
          
          // Show success message and close modal after delay
          setTimeout(() => {
            if (onUpdateSuccess) {
              onUpdateSuccess();
            } else if (onClose) {
              onClose();
            }
          }, 1000);
        }
      } else {
        // For creating new book
        formDataToSend.append('title', formData.title);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('isbn', formData.isbn);
        formDataToSend.append('publisher', formData.publisher);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('total_copies', formData.total_copies);
        
        // FIXED: Use correct field name 'bookImage' instead of 'book_images'
        if (bookImage) {
          formDataToSend.append('bookImage', bookImage);
        }

        const response = await api.post('/addBook', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success && response.data.message === "Book Added") {
          setSuccess('Book added successfully!');
          
          // Reset form after successful submission
          setFormData(initialFormData);
          setBookImage(null);
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
    const hasChanges = Object.values(formData).some(value => value.trim() !== '') || bookImage;
    
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
    return `w-full pl-10 pr-4 py-2.5 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
      theme === 'dark'
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`;
  };

  const renderBookImageUpload = () => {
    return (
      <div className="mb-4 text-center">
        <div className={`relative inline-block ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        } rounded-full p-1`}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Book preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <BookOpen className={`w-8 h-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
              }`} />
            </div>
          )}
          
          <label className={`absolute bottom-0 right-0 ${
            theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
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
          Choose book cover (optional)
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
              theme === 'dark' ? 'bg-green-600/90' : 'bg-green-100/90'
            }`}>
              {isEditing ? (
                <Edit2 className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-white' : 'text-green-600'
                }`} />
              ) : (
                <BookOpen className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-white' : 'text-green-600'
                }`} />
              )}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isEditing ? 'Update Book' : 'Add New Book'}
            </h2>
            <p className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {isEditing ? 'Update book information' : 'Add a new book to the library'}
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
              {/* Book Image Upload - Full Width */}
              <div className="md:col-span-2">
                {renderBookImageUpload()}
              </div>

              {/* Title */}
              <div className="md:col-span-2 relative">
                <BookOpen className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Book Title"
                  required
                />
              </div>

              {/* Author */}
              <div className="relative">
                <User className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Author"
                  required
                />
              </div>

              {/* ISBN */}
              <div className="relative">
                <Hash className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  className={getInputClasses()}
                  placeholder="ISBN"
                  required
                />
              </div>

              {/* Publisher */}
              <div className="relative">
                <Building className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Publisher"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <Layers className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className={getInputClasses()}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Copies */}
              <div className="relative">
                <Package className={`absolute left-3 top-3 h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="number"
                  value={formData.total_copies}
                  onChange={(e) => handleInputChange('total_copies', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Total Copies"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full text-white py-2.5 rounded-md font-medium transition duration-200 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Adding Book...'}
                  </span>
                ) : (
                  <>
                    {isEditing ? <Edit2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Update Book' : 'Add Book'}
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