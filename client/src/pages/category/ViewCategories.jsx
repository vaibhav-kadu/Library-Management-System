import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Folder, Loader } from 'lucide-react';

export default function ViewCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getCategories');
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
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Book Categories</h2>
          <Folder className="w-8 h-8 text-blue-600" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && <div className="text-red-700 bg-red-100 p-2 rounded mb-4">{error}</div>}

        {/* Table */}
        {!loading && !error && (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">#</th>
                <th className="py-3 px-4 text-left text-gray-600">Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr key={cat.category_id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{cat.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
