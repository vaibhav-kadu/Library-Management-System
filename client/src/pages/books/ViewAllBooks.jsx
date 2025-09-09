import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Loader,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  User,
  Package,
  PackageCheck,
  PackageMinus,
  Search,
  Filter,
  Plus,
  Building,
  Hash
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import AddBook from "./AddBook";

export default function ViewAllBook({ theme = "light" }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [borrowing, setBorrowing] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  
  // Add Book Modal states
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const isDark = theme === 'dark';

  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getBooks");
      if (response.data.success) {
        setBooks(response.data.books);
      } else {
        setError("Failed to load books");
      }
    } catch (err) {
      setError("Server error while fetching books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // View handler - Enhanced view modal (similar to student profile click)
  const handleView = (book) => {
    const availableCopies = book.total_copies - book.issued_copies;
    alert(`Book Details:
Title: ${book.title}
Author: ${book.author}
ISBN: ${book.isbn}
Publisher: ${book.publisher}
Total Copies: ${book.total_copies}
Issued Copies: ${book.issued_copies}
Available Copies: ${availableCopies}`);
  };

  // Edit handler
  const handleEdit = (book) => {
    setEditingBook(book);
    setShowAddBook(true);
  };

  // DELETE handler (for admin only)
  const handleDelete = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) return;

    setDeleting(bookId);
    setError(null);
    setSuccess(null);

    try {
      // Fixed: Use URL parameter instead of request body
      const response = await axios.delete(`http://localhost:3000/deleteBook/${bookId}`);
      
      if (response.data.success || response.data.message === "Book Deleted") {
        setBooks(
          books.filter((book) => (book.book_id || book.id) !== bookId)
        );
        setSuccess("Book deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to delete book");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to delete book");
    } finally {
      setDeleting(null);
    }
  };

  // BORROW handler (for student)
  const handleBorrow = async (bookId, bookTitle) => {
    if (!window.confirm(`Do you want to borrow "${bookTitle}"?`)) return;

    setBorrowing(bookId);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/borrowBook",
        { book_id: bookId, sid: user.sid },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSuccess(`Successfully borrowed "${bookTitle}"!`);
        setTimeout(() => setSuccess(null), 3000);
        fetchBooks(); // Refresh to show updated counts
      } else {
        setError(response.data.message || "Failed to borrow book");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to borrow book");
    } finally {
      setBorrowing(null);
    }
  };

  // Handle close AddBook modal
  const handleCloseAddBook = () => {
    setShowAddBook(false);
    setEditingBook(null);
  };

  // Handle successful update
  const handleUpdateSuccess = () => {
    setShowAddBook(false);
    setEditingBook(null);
    fetchBooks(); // Refresh the list
    setSuccess("Book updated successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // Filter and sort books
  const filteredAndSortedBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        (book.isbn || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "author":
          return a.author.localeCompare(b.author);
        case "recent":
          return (b.book_id || b.id) - (a.book_id || a.id);
        case "available":
          return (b.total_copies - b.issued_copies) - (a.total_copies - a.issued_copies);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  const BookCard = ({ book }) => {
    const availableCopies = book.total_copies - book.issued_copies;
    const bookId = book.book_id || book.id;

    const renderActionButtons = () => {
      if (!user) {
        return (
          <div className="text-center text-gray-500 py-2">
            <span className="text-sm">Login to interact with books</span>
          </div>
        );
      }

      switch (user.role) {
        case 'student':
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleBorrow(bookId, book.title)}
                disabled={borrowing === bookId || availableCopies === 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {borrowing === bookId ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Borrow
              </button>
              <button
                onClick={() => handleView(book)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-200"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
            </div>
          );

        case 'librarian':
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(book)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-200"
              >
                <Edit2 className="w-4 h-4" />
                Update
              </button>
              <button
                onClick={() => handleView(book)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-200"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
            </div>
          );

        case 'admin':
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(book)}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-1 shadow-md hover:scale-105 transition-transform duration-200 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Update
              </button>
              <button
                onClick={() => handleView(book)}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-1 shadow-md hover:scale-105 transition-transform duration-200 text-sm"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => handleDelete(bookId, book.title)}
                disabled={deleting === bookId}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl flex items-center justify-center gap-1 shadow-md hover:scale-105 transition-transform duration-200 disabled:opacity-50 text-sm"
              >
                {deleting === bookId ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div
        className={`group relative rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer
          ${isDark ? "bg-gray-800 border border-gray-600" : "bg-white border border-gray-200"} overflow-hidden`}
        onClick={() => handleView(book)}
      >
        {/* Book Image */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          {book.bookImage && book.bookImage !== 'null' ? (
            <div className="relative">
              <img
                src={`http://localhost:3000/book_images/${book.bookImage}?${Date.now()}`}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hidden items-center justify-center">
                <BookOpen className="w-16 h-16 opacity-80" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <BookOpen className="w-16 h-16 opacity-80" />
            </div>
          )}

          {/* Available/Unavailable Badge */}
          <div className="absolute top-3 right-3">
            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
              availableCopies > 0 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {availableCopies > 0 ? 'Available' : 'Unavailable'}
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className={`${isDark ? "text-white" : "text-gray-900"} text-lg font-bold leading-tight line-clamp-2`}>
            {book.title}
          </h3>

          {/* Author */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} truncate`}>
              {book.author}
            </span>
          </div>

          {/* ISBN */}
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} truncate`}>
              {book.isbn}
            </span>
          </div>

          {/* Publisher */}
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} truncate`}>
              {book.publisher}
            </span>
          </div>

          {/* Copies Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Total: {book.total_copies}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-orange-500" />
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Issued: {book.issued_copies}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <PackageMinus className="w-4 h-4 text-green-500" />
              <span className={`text-sm font-semibold ${
                availableCopies > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                Available: {availableCopies}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${book.total_copies > 0 ? ((book.total_copies - book.issued_copies) / book.total_copies) * 100 : 0}%` 
              }}
            ></div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2" onClick={(e) => e.stopPropagation()}>
            {renderActionButtons()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-green-600/20" : "bg-green-100"
              }`}>
                <BookOpen className={`w-5 h-5 ${
                  isDark ? "text-green-400" : "text-green-600"
                }`} />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Library Collection
                </h1>
                {user && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Logged in as: <span className="font-semibold capitalize">{user.role}</span> - {user.name}
                  </p>
                )}
              </div>
            </div>
            
            {/* Header Controls */}
            <div className="flex items-center gap-4">
              {/* Book Count */}
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                Total: {filteredAndSortedBooks.length}
              </div>
              
              {/* Search Bar */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Search books..."
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="title">Sort by Title</option>
                  <option value="author">Sort by Author</option>
                  <option value="recent">Sort by Recent</option>
                  <option value="available">Sort by Available</option>
                </select>
              </div>

              {/* Add Book Button - Only for Admin and Librarian */}
              {user && (user.role === 'admin' || user.role === 'librarian') && (
                <button
                  onClick={() => {
                    setEditingBook(null);
                    setShowAddBook(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg flex items-center gap-2 shadow-md hover:scale-105 transition-transform duration-200 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Book
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Error / Success Messages */}
          {error && (
            <div className={`mb-3 p-3 rounded-lg border text-sm ${
              isDark
                ? "bg-red-900/20 border-red-800 text-red-400"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {error}
            </div>
          )}
          {success && (
            <div className={`mb-3 p-3 rounded-lg border text-sm ${
              isDark
                ? "bg-green-900/20 border-green-800 text-green-400"
                : "bg-green-50 border-green-200 text-green-700"
            }`}>
              {success}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-8">
              <Loader className={`w-5 h-5 animate-spin ${
                isDark ? "text-green-400" : "text-green-500"
              }`} />
              <span className={`ml-2 text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                Loading books...
              </span>
            </div>
          )}

          {/* Books Grid */}
          {!loading && !error && (
            <>
              {filteredAndSortedBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedBooks.map((book) => (
                    <BookCard key={book.book_id || book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-20 rounded-2xl ${
                  isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
                }`}>
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No books found</h3>
                  <p className="text-lg">
                    {search ? "Try adjusting your search terms." : "No books available in the library."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* AddBook Modal */}
      {showAddBook && (
        <AddBook
          onClose={handleCloseAddBook}
          theme={theme}
          editingBook={editingBook}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
}