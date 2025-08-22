import React, { useState } from 'react';
import axios from 'axios';
import { FolderPlus } from 'lucide-react';

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/addCategory', { name: categoryName });
      if (response.data.success) {
        setSuccess('Category added successfully!');
        setCategoryName('');
      } else {
        setError('Failed to add category');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FolderPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
          <p className="text-gray-600 mt-2">Create a category for organizing books</p>
        </div>

        {/* Error / Success Messages */}
        {error && <div className="text-red-700 bg-red-100 p-2 rounded mb-4">{error}</div>}
        {success && <div className="text-green-700 bg-green-100 p-2 rounded mb-4">{success}</div>}

        {/* Form */}
        <form onSubmit={handleAddCategory} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter category name"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-blue-700 transform hover:scale-105"
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
    </div>
  );
}

