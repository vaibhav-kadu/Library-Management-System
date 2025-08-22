import React, { useState } from 'react';
import { BookPlus } from 'lucide-react';
import axios from 'axios';

export default function AddBook() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        category_id: '',
        total_copies: '',
        image: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');

            const form = new FormData();
            for (const key in formData) {
                form.append(key, formData[key]);
            }

            const response = await axios.post('http://localhost:3000/addBook', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });


            if (response.data.success) {
                setSuccess('Book added successfully!');
                setFormData({
                    title: '',
                    author: '',
                    isbn: '',
                    publisher: '',
                    category_id: '',
                    total_copies: '',
                    image: ''
                });
            } else {
                setError('Failed to add book');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full">
                <div className="flex items-center justify-center mb-6">
                    <BookPlus className="w-10 h-10 text-green-600" />
                    <h2 className="text-2xl font-bold ml-2 text-gray-800">Add New Book</h2>
                </div>

                {error && <div className="text-red-700 bg-red-100 p-2 rounded mb-4">{error}</div>}
                {success && <div className="text-green-700 bg-green-100 p-2 rounded mb-4">{success}</div>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Book Title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500" required />
                    <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500" required />
                    <input type="text" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500" required />
                    <input type="text" name="publisher" placeholder="Publisher" value={formData.publisher} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500" required />
                    <input type="number" name="category_id" placeholder="Category ID" value={formData.category_id} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500" required />
                    <input type="number" name="total_copies" placeholder="Total Copies" value={formData.total_copies} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500" required />
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
                        required
                    />

                    <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-all duration-200">
                        {loading ? 'Adding Book...' : 'Add Book'}
                    </button>
                </form>
            </div>
        </div>
    );
}
