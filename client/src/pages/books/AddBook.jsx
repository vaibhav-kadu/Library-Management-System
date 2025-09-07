import React, { useState, useEffect } from 'react';
import { BookOpen, Camera, Save, X, User, Hash, Building, Layers, Package } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddBook({ onClose, theme = 'light' }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category_id: '',
    total_copies: ''
  });

  const [categories, setCategories] = useState([]); // 🔹 store categories
  const [bookImage, setBookImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // 🔹 Fetch categories from backend
  useEffect(() => {
    axios.get("http://localhost:3000/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Image upload
  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setBookImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Validation
  const validateForm = (data) => {
    if (!data.title.trim()) return "Book title is required";
    if (!data.author.trim()) return "Author is required";
    if (!data.isbn.trim()) return "ISBN is required";
    if (!data.publisher.trim()) return "Publisher is required";
    if (!data.category_id.trim()) return "Category is required";
    if (!data.total_copies || isNaN(data.total_copies) || data.total_copies <= 0) return "Total copies must be a positive number";
    return null;
  };

  // Submit
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
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      if (bookImage) formDataToSend.append('image', bookImage);

      const response = await axios.post("http://localhost:3000/addBook", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        setSuccess("Book added successfully!");
        setFormData({ title: '', author: '', isbn: '', publisher: '', category_id: '', total_copies: '' });
        setBookImage(null);
        setImagePreview(null);

        setTimeout(() => {
          setSuccess(null);
          if (onClose) onClose();
          else navigate(-1);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Server Error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    const hasChanges = Object.values(formData).some(v => v.trim() !== '') || bookImage;
    if (hasChanges) {
      if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
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

  // Image Upload UI
  const renderImageUpload = () => (
    <div className="mb-4 text-center">
      <div className={`relative inline-block ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full p-1`}>
        {imagePreview ? (
          <img src={imagePreview} alt="Book preview" className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
          }`}>
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <label className={`absolute bottom-0 right-0 ${
          theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
        } text-white rounded-full p-1.5 cursor-pointer`}>
          <Camera className="w-3 h-3" />
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0])} />
        </label>
      </div>
      <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        Upload book cover (optional)
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className={`relative rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Close */}
        <button onClick={handleCancel} className={`absolute top-4 right-4 p-2 rounded-full ${
          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }`}>
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            theme === 'dark' ? 'bg-green-600/90' : 'bg-green-100/90'
          }`}>
            <BookOpen className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-green-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add New Book</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Enter book details below</p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm p-3 rounded-md border text-red-700 bg-red-50 border-red-200">{error}</div>}
            {success && <div className="text-sm p-3 rounded-md border text-green-700 bg-green-50 border-green-200">{success}</div>}

            {renderImageUpload()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Title" value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)} className={getInputClasses()} required />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Author" value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)} className={getInputClasses()} required />
              </div>

              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="ISBN" value={formData.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)} className={getInputClasses()} required />
              </div>

              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Publisher" value={formData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)} className={getInputClasses()} required />
              </div>

              {/* 🔹 Category Dropdown */}
              <div className="relative">
                <Layers className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange("category_id", e.target.value)}
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

              <div className="relative">
                <Package className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input type="number" placeholder="Total Copies" value={formData.total_copies}
                  onChange={(e) => handleInputChange('total_copies', e.target.value)} className={getInputClasses()} required />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <button type="submit" disabled={submitting}
                className="w-full text-white py-2.5 rounded-md font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center justify-center">
                {submitting ? "Adding Book..." : (<><Save className="w-4 h-4 mr-2" /> Add Book</>)}
              </button>
              <button type="button" onClick={handleCancel}
                className={`w-full py-2.5 rounded-md font-medium border ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'
                }`}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
