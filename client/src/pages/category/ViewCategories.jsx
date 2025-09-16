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

  const isDark = theme === 'dark';

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

  const handleUpdate = async (category_id) => {
    if (!editingName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    setUpdating(category_id);
    setError(null);
    setSuccess(null);

    try {
      // Updated to pass id and name in request body
      const response = await axios.put("http://localhost:3000/updateCategory",{category_id:category_id, name: editingName.trim()});

      if (response.data.success) {
        setCategories(categories.map(cat => 
          (cat.category_id || cat.id) === category_id 
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

const handleDelete = async (category_id, categoryName) => {
  if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
    return;
  }

  setDeleting(category_id);
  setError(null);
  setSuccess(null);

  try {
    // Fixed: Send ID as URL parameter to match backend route
    const response = await axios.delete("http://localhost:3000/deleteCategory",{
      params:{category_id:category_id}
    });

    if (response.data.success) {
      setCategories(categories.filter(cat => (cat.category_id || cat.id) !== category_id));
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

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const showMessage = (message, type) => (
    <div className={`mb-6 p-4 rounded-lg border ${
      type === 'error' 
        ? isDark ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
        : isDark ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
    }`}>
      {message}
    </div>
  );

  const ActionButton = ({ onClick, disabled, icon: Icon, color, title, loading = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2.5 rounded-lg disabled:opacity-50 ${
        isDark 
          ? `bg-${color}-600/20 text-${color}-400 hover:bg-${color}-600/30` 
          : `bg-${color}-100 text-${color}-600 hover:bg-${color}-200`
      }`}
      title={title}
    >
      {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
    </button>
  );

  if (loading) {
    return (
      <div className={`max-w-4xl mx-auto rounded-2xl shadow-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-center items-center py-12">
          <Loader className={`w-6 h-6 animate-spin mr-3 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto rounded-2xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-8 py-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
            <Folder className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Book Categories
          </h2>
          <div className={`px-4 py-2 rounded-lg border font-medium ${
            isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-600'
          }`}>
            Total: {filteredCategories.length}
          </div>
                    <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Search categories..."
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">

        {/* Messages */}
        {error && showMessage(error, 'error')}
        {success && showMessage(success, 'success')}

        {/* Table */}
        <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`py-4 px-6 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Sr. No
                </th>
                <th className={`py-4 px-6 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Category Name
                </th>
                <th className={`py-4 px-6 text-center text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Status
                </th>
                <th className={`py-4 px-6 text-center text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat, index) => {
                  const category_id = cat.category_id || cat.id;
                  const isEditing = editingId === category_id;

                  return (
                    <tr key={category_id} className={isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                      <td className={`py-4 px-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                        {index + 1}
                      </td>
                      <td className={`py-4 px-6 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Category name"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-medium">{cat.name}</span>
                        )}
                      </td>
                      <td className={`py-4 px-6 text-center ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cat.status === 'active'
                            ? isDark ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-600'
                            :cat.status === 'inactive'? isDark ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-600'
                            : isDark ? 'bg-gray-600/20 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {cat.status || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          {isEditing ? (
                            <>
                              <ActionButton
                                onClick={() => handleUpdate(category_id)}
                                disabled={updating === category_id}
                                icon={Save}
                                color="green"
                                title="Save changes"
                                loading={updating === category_id}
                              />
                              <ActionButton
                                onClick={handleCancelEdit}
                                icon={X}
                                color="gray"
                                title="Cancel editing"
                              />
                            </>
                          ) : (
                            <>
                              <ActionButton
                                onClick={() => handleEdit(cat)}
                                icon={Edit2}
                                color="blue"
                                title="Edit category"
                              />
                              <ActionButton
                                onClick={() => handleDelete(category_id, cat.name)}
                                disabled={deleting === category_id}
                                icon={Trash2}
                                color="red"
                                title="Delete category"
                                loading={deleting === category_id}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex flex-col items-center space-y-3">
                      <Folder className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                      <div>
                        <p className="text-lg font-medium">No categories found</p>
                        <p className="text-sm">
                          {search ? 'Try adjusting your search terms' : 'Add categories to see them listed here'}
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
    </div>
  );
}