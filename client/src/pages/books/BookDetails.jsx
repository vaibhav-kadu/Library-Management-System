import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, BookOpen, User, Calendar, Hash, Building2, Tag, Copy, Loader, Image as ImageIcon } from "lucide-react";

export default function BookDetails({ bookId, onClose, theme = "light" }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/getBookById",{params:{book_id:bookId}});
        if (response.data.success) {            
          setBook(response.data.book);
        } else {
          setError("Failed to load book details");
        }
      } catch (err) {
        setError("Server error while fetching book details");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!bookId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? "bg-blue-600/20" : "bg-blue-100"
            }`}>
              <BookOpen className={`w-5 h-5 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`} />
            </div>
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Book Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader className={`w-6 h-6 animate-spin ${
                isDark ? "text-blue-400" : "text-blue-500"
              }`} />
              <span className={`ml-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                Loading book details...
              </span>
            </div>
          )}

          {error && (
            <div className={`p-4 rounded-lg border text-center ${
              isDark
                ? "bg-red-900/20 border-red-800 text-red-400"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {error}
            </div>
          )}

          {book && !loading && !error && (
            <div className="space-y-6">
              {/* Book Image and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {book.image ? (
                    <img
                      src={`http://localhost:3000/book_images/${book.image}`}
                      alt={book.title}
                      className={`w-32 h-40 object-cover rounded-lg border-2 shadow-md ${
                        isDark ? 'border-gray-600' : 'border-gray-300'
                      }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-32 h-40 rounded-lg border-2 flex items-center justify-center ${
                    book.image ? 'hidden' : 'flex'
                  } ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'
                  }`}>
                    <ImageIcon className={`w-12 h-12 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className={`text-2xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {book.title}
                    </h4>
                    <p className={`text-lg ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      by {book.author || 'Unknown Author'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Hash className={`w-4 h-4 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Book ID
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    #{book.book_id}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Copy className={`w-4 h-4 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      ISBN
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {book.isbn || 'Not Available'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className={`w-4 h-4 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Publisher
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {book.publisher || 'Not Available'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className={`w-4 h-4 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Category ID
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {book.category_id || 'Not Assigned'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Copy className={`w-4 h-4 ${
                      isDark ? 'text-green-500' : 'text-green-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Total Copies
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {book.total_copies}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Copy className={`w-4 h-4 ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Issued Copies
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {book.issued_copies || 0}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Copy className={`w-4 h-4 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Available Copies
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {book.total_copies - (book.issued_copies || 0)}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className={`w-4 h-4 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Added On
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formatDate(book.added_on)}
                  </p>
                </div>
              </div>

              {/* Availability Status */}
              <div className={`p-4 rounded-lg border ${
                book.total_copies - (book.issued_copies || 0) > 0
                  ? isDark 
                    ? 'bg-green-900/20 border-green-800' 
                    : 'bg-green-50 border-green-200'
                  : isDark
                    ? 'bg-red-900/20 border-red-800'
                    : 'bg-red-50 border-red-200'
              }`}>
                <h5 className={`font-semibold mb-2 ${
                  book.total_copies - (book.issued_copies || 0) > 0
                    ? isDark ? 'text-green-400' : 'text-green-800'
                    : isDark ? 'text-red-400' : 'text-red-800'
                }`}>
                  Availability Status
                </h5>
                <p className={`text-sm ${
                  book.total_copies - (book.issued_copies || 0) > 0
                    ? isDark ? 'text-green-300' : 'text-green-700'
                    : isDark ? 'text-red-300' : 'text-red-700'
                }`}>
                  {book.total_copies - (book.issued_copies || 0) > 0
                    ? `${book.total_copies - (book.issued_copies || 0)} copies available for issue`
                    : 'Currently out of stock - all copies have been issued'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}