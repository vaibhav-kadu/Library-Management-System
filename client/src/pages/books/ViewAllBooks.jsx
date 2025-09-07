import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Loader,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  User,
  Hash,
  Filter,
  Star,
} from "lucide-react";

export default function ViewAllBook({ theme = "light" }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ title: "", author: "", isbn: "" });
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");

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

  // Edit handlers
  const handleEdit = (book) => {
    setEditingId(book.book_id || book.id);
    setEditingData({ title: book.title, author: book.author, isbn: book.isbn });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({ title: "", author: "", isbn: "" });
  };

  const handleUpdate = async (bookId) => {
    if (!editingData.title.trim() || !editingData.author.trim()) {
      setError("Title and Author cannot be empty");
      return;
    }
    setUpdating(bookId);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put("http://localhost:3000/updateBook", {
        id: bookId,
        ...editingData,
      });
      if (response.data.success) {
        setBooks(
          books.map((b) =>
            (b.book_id || b.id) === bookId ? { ...b, ...editingData } : b
          )
        );
        setEditingId(null);
        setSuccess("Book updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to update book");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update book");
    } finally {
      setUpdating(null);
    }
  };

  // DELETE handler
  const handleDelete = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) return;

    setDeleting(bookId);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.delete("http://localhost:3000/deleteBook", { data: { id: bookId } });
      if (response.data.message === "Book Deleted") {
        setBooks(books.filter((b) => (b.book_id || b.id) !== bookId));
        setSuccess("Book deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to delete book");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete book");
    } finally {
      setDeleting(null);
    }
  };

  const filteredAndSortedBooks = books
    .filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        (b.isbn || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "author":
          return a.author.localeCompare(b.author);
        case "recent":
          return (b.book_id || b.id) - (a.book_id || a.id);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  const BookCard = ({ book, index }) => {
    const bookId = book.book_id || book.id;
    const isEditing = editingId === bookId;

    return (
      <div
        className={`group relative rounded-3xl shadow-xl transition-all duration-500 transform hover:-translate-y-2
          ${theme === "dark" ? "bg-gray-800 border border-gray-600 text-white" : "bg-white border border-gray-200 text-gray-900"} overflow-hidden`}
      >
        {/* Book Cover */}
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <BookOpen className="w-12 h-12 opacity-80" />
            </div>
          )}

          <div className="absolute top-4 right-4">
            <div className="px-3 py-1 bg-black/50 text-white rounded-full text-sm font-semibold">
              #{String(index + 1).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editingData.title}
                onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-lg ${
                  theme === "dark" ? "bg-gray-900 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="Book Title"
              />
            ) : (
              <h3 className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-xl font-bold leading-tight`}>
                {book.title}
              </h3>
            )}
          </div>

          {/* Author */}
          <div className="flex items-center space-x-3">
            <User className="w-4 h-4 text-gray-400" />
            {isEditing ? (
              <input
                type="text"
                value={editingData.author}
                onChange={(e) => setEditingData({ ...editingData, author: e.target.value })}
                className={`flex-1 px-3 py-2 border-2 rounded-xl ${
                  theme === "dark" ? "bg-gray-900 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="Author Name"
              />
            ) : (
              <span className={theme === "dark" ? "text-gray-200" : "text-gray-900"}>{book.author}</span>
            )}
          </div>

          {/* ISBN */}
          <div className="flex items-center space-x-3">
            <Hash className="w-4 h-4 text-gray-400" />
            {isEditing ? (
              <input
                type="text"
                value={editingData.isbn}
                onChange={(e) => setEditingData({ ...editingData, isbn: e.target.value })}
                className={`flex-1 px-3 py-2 border-2 rounded-xl ${
                  theme === "dark" ? "bg-gray-900 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="ISBN"
              />
            ) : (
              <code className={`text-sm px-2 py-1 rounded-lg ${
                theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
              }`}>
                {book.isbn || "N/A"}
              </code>
            )}
          </div>

          {/* Book ID */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <span className="text-sm font-medium text-gray-300">Book ID: {bookId}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">New</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4 gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleUpdate(bookId)}
                  disabled={updating === bookId}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-200"
                >
                  {updating === bookId ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 bg-gray-500/80 hover:bg-gray-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <X className="w-5 h-5" /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(book)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-200"
                >
                  <Edit2 className="w-5 h-5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(bookId, book.title)}
                  disabled={deleting === bookId}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-200"
                >
                  {deleting === bookId ? <Loader className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"} min-h-screen`}>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className={`rounded-3xl shadow-2xl p-8 mb-8 ${theme === "dark" ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200"}`}>
          <h1 className="text-4xl font-black mb-2">Book Collection</h1>
          <p className="text-lg font-medium">{books.length} {books.length === 1 ? "book" : "books"} in your digital library</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>

        {/* Search & Sort */}
        <div className={`rounded-3xl shadow-xl p-6 mb-8 ${theme === "dark" ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200"}`}>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 ${
                  theme === "dark" ? "bg-gray-900 text-white border-gray-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                }`}
                placeholder="Search books by title, author, or ISBN..."
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-6 py-4 rounded-2xl border-2 ${
                  theme === "dark" ? "bg-gray-900 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
              >
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="recent">Sort by Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className={`w-12 h-12 animate-spin ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} />
          </div>
        ) : filteredAndSortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedBooks.map((book, index) => (
              <BookCard key={book.book_id || book.id} book={book} index={index} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 rounded-3xl ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No books found</h3>
            <p className="text-lg">{`Try adjusting your search terms or add your first book.`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
