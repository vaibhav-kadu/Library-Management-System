import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ViewBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/books');
        setBooks(response.data);
      } catch (err) {
        setError('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="text-center text-gray-600 mt-10">Loading books...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">All Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.book_id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img src={`/images/${book.image}`} alt={book.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
              <p className="text-gray-600 text-sm">Author: {book.author}</p>
              <p className="text-gray-600 text-sm">Publisher: {book.publisher}</p>
              <p className="text-gray-600 text-sm">ISBN: {book.isbn}</p>
              <p className="text-gray-600 text-sm">Total: {book.total_copies} | Issued: {book.issued_copies}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
