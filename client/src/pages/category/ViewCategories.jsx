import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Folder, Loader, Edit2, Trash2, Save, X, Search } from 'lucide-react';

export default function ViewCategories({ theme = 'light' }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getCategory');
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      setError('Server error while fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditingId(category.category_id || category.id);
    setEditingName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = async (categoryId) => {
    if (!editingName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    setUpdating(categoryId);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(`http://localhost:3000/updateCategory/${categoryId}`, {
        name: editingName.trim()
      });

      if (response.data.success) {
        setCategories(categories.map(cat => 
          (cat.category_id || cat.id) === categoryId 
            ? { ...cat, name: editingName.trim() }
            : cat
        ));
        setEditingId(null);
        setEditingName('');
        setSuccess('Category updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update category');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update category');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(categoryId);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.delete(`http://localhost:3000/deleteCategory/${categoryId}`);

      if (response.data.success) {
        setCategories(categories.filter(cat => (cat.category_id || cat.id) !== categoryId));
        setSuccess(response.data.message || 'Category deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete category');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  // Filtered categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      <div
        className={`max-w-4xl mx-auto rounded-2xl shadow-lg overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`px-8 py-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-full ${
                theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
              }`}
            >
              <Folder
                className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}
              />
            </div>
            <div>
              <h2
                className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Book Categories
              </h2>
              <p
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Manage and organize your library categories
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Search Input */}
          <div className="mb-6 flex items-center relative">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Search categories..."
            />
          </div>

          {/* Messages */}
          {error && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-red-900/20 border-red-800 text-red-400'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-green-900/20 border-green-800 text-green-400'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}
            >
              {success}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="flex items-center space-x-3">
                <Loader
                  className={`w-6 h-6 animate-spin ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                  }`}
                />
                <span
                  className={`${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Loading categories...
                </span>
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div
              className={`rounded-xl border overflow-hidden ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div
                className={`overflow-x-auto ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <table className="w-full">
                  <thead
                    className={`${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <tr>
                      <th
                        className={`py-4 px-6 text-left text-sm font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        Sr. No
                      </th>
                      <th
                        className={`py-4 px-6 text-left text-sm font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        Category Name
                      </th>
                      <th
                        className={`py-4 px-6 text-center text-sm font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat, index) => {
                        const categoryId = cat.category_id || cat.id;
                        const isEditing = editingId === categoryId;

                        return (
                          <tr
                            key={categoryId}
                            className={`transition-colors duration-150 ${
                              theme === 'dark'
                                ? 'hover:bg-gray-700/50'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <td
                              className={`py-4 px-6 text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-900'
                              }`}
                            >
                              {index + 1}
                            </td>
                            <td
                              className={`py-4 px-6 ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-900'
                              }`}
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) =>
                                    setEditingName(e.target.value)
                                  }
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                    theme === 'dark'
                                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                  }`}
                                  placeholder="Category name"
                                  autoFocus
                                />
                              ) : (
                                <span className="text-sm font-medium">
                                  {cat.name}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center space-x-2">
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleUpdate(categoryId)}
                                      disabled={updating === categoryId}
                                      className={`p-2 rounded-lg transition-all duration-200 ${
                                        theme === 'dark'
                                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                                      } disabled:opacity-50`}
                                      title="Save changes"
                                    >
                                      {updating === categoryId ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Save className="w-4 h-4" />
                                      )}
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className={`p-2 rounded-lg transition-all duration-200 ${
                                        theme === 'dark'
                                          ? 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                      title="Cancel editing"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEdit(cat)}
                                      className={`p-2 rounded-lg transition-all duration-200 ${
                                        theme === 'dark'
                                          ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                      }`}
                                      title="Edit category"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDelete(categoryId, cat.name)
                                      }
                                      disabled={deleting === categoryId}
                                      className={`p-2 rounded-lg transition-all duration-200 ${
                                        theme === 'dark'
                                          ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                                      } disabled:opacity-50`}
                                      title="Delete category"
                                    >
                                      {deleting === categoryId ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className={`text-center py-12 ${
                            theme === 'dark'
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-3">
                            <Folder
                              className={`w-12 h-12 ${
                                theme === 'dark'
                                  ? 'text-gray-600'
                                  : 'text-gray-300'
                              }`}
                            />
                            <div>
                              <p className="text-lg font-medium">
                                No categories found
                              </p>
                              <p className="text-sm">
                                Add categories to see them listed here
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Stats */}
          {!loading && !error && filteredCategories.length > 0 && (
            <div
              className={`mt-6 p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Total Categories: {filteredCategories.length}
                </span>
                <span
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Use the search, edit, and delete buttons to manage categories
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
