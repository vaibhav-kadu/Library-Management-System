import React, { useEffect, useState } from "react";
import api from '../../utils/api';
const BASE_URL = import.meta.env.VITE_API_URL;
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
  Building,
  Hash
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
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
  
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const isDark = theme === 'dark';

  const fetchBooks = async () => {
    try {
      const response = await api.get('/getBooks');
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

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowAddBook(true);
  };

  const handleDelete = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) return;

    setDeleting(bookId);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.delete(`/deleteBook/${bookId}`);
      
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

  const handleBorrow = async (bookId, bookTitle) => {
    if (!window.confirm(`Do you want to borrow "${bookTitle}"?`)) return;

    setBorrowing(bookId);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem("token");
      const response = await api.post('/borrowBook',
        { book_id: bookId, sid: user.sid },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSuccess(`Successfully borrowed "${bookTitle}"!`);
        setTimeout(() => setSuccess(null), 3000);
        fetchBooks();
      } else {
        setError(response.data.message || "Failed to borrow book");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to borrow book");
    } finally {
      setBorrowing(null);
    }
  };

  const handleCloseAddBook = () => {
    setShowAddBook(false);
    setEditingBook(null);
  };

  const handleUpdateSuccess = () => {
    setShowAddBook(false);
    setEditingBook(null);
    fetchBooks();
    setSuccess("Book updated successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

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
          <div className="text-center text-muted py-2">
            <small>Login to interact with books</small>
          </div>
        );
      }

      switch (user.role) {
        case 'student':
          return (
            <div className="d-flex gap-2">
              <button
                onClick={() => handleBorrow(bookId, book.title)}
                disabled={borrowing === bookId || availableCopies === 0}
                className="btn btn-primary btn-sm flex-fill"
              >
                {borrowing === bookId ? (
                  <Loader className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    <CheckCircle size={16} className="me-1" />
                    Borrow
                  </>
                )}
              </button>
              <button
                onClick={() => handleView(book)}
                className="btn btn-info btn-sm flex-fill"
              >
                <Eye size={16} className="me-1" />
                View
              </button>
            </div>
          );

        case 'librarian':
          return (
            <div className="d-flex gap-2">
              <button
                onClick={() => handleEdit(book)}
                className="btn btn-success btn-sm flex-fill"
              >
                <Edit2 size={16} className="me-1" />
                Update
              </button>
              <button
                onClick={() => handleView(book)}
                className="btn btn-info btn-sm flex-fill"
              >
                <Eye size={16} className="me-1" />
                View
              </button>
            </div>
          );

        case 'admin':
          return (
            <div className="d-flex gap-1">
              <button
                onClick={() => handleEdit(book)}
                className="btn btn-success btn-sm flex-fill"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleView(book)}
                className="btn btn-info btn-sm flex-fill"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => handleDelete(bookId, book.title)}
                disabled={deleting === bookId}
                className="btn btn-danger btn-sm flex-fill"
              >
                {deleting === bookId ? (
                  <Loader className="spinner-border spinner-border-sm" size={14} />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className={`card h-100 border hover-lift ${isDark ? "bg-surface" : "bg-light"}`}>
        <div className="position-relative" style={{height: '288px'}}>
          {book.bookImage && book.bookImage !== 'null' ? (
            <img
              src={`${BASE_URL}/book_images/${book.bookImage}?${Date.now()}`}
              alt={book.title}
              className="card-img-top h-100 object-fit-cover"
              onError={(e)=>{e.target.style.display='none'}}
            />
          ) : (
            <div className="d-flex align-items-center justify-center h-100 bg-gradient-primary text-white">
              <BookOpen size={64} className="opacity-75" />
            </div>
          )}
          <span className={`position-absolute top-0 end-0 m-2 badge ${availableCopies > 0 ? 'bg-success' : 'bg-danger'}`}>
            {availableCopies > 0 ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="card-body">
          <h5 className={`card-title ${isDark ? "text-white" : "text-dark"} text-truncate`} title={book.title}>
            {book.title}
          </h5>

          <div className="d-flex align-items-center gap-2 mb-2">
            <User size={16} className="text-muted" />
            <small className={`${isDark ? "text-white-50" : "text-muted"} text-truncate`}>
              {book.author}
            </small>
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <Hash size={16} className="text-muted" />
            <small className={`${isDark ? "text-white-50" : "text-muted"} text-truncate`}>
              {book.isbn}
            </small>
          </div>

          <div className="d-flex align-items-center gap-2 mb-3">
            <Building size={16} className="text-muted" />
            <small className={`${isDark ? "text-white-50" : "text-muted"} text-truncate`}>
              {book.publisher}
            </small>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between mb-2">
              <div className="d-flex align-items-center gap-1">
                <Package size={16} className="text-primary" />
                <small className={isDark ? "text-white-50" : "text-muted"}>
                  Total: {book.total_copies}
                </small>
              </div>
              <div className="d-flex align-items-center gap-1">
                <PackageCheck size={16} className="text-warning" />
                <small className={isDark ? "text-white-50" : "text-muted"}>
                  Issued: {book.issued_copies}
                </small>
              </div>
            </div>
            
            <div className="d-flex align-items-center gap-1">
              <PackageMinus size={16} className="text-success" />
              <small className={`fw-bold ${availableCopies > 0 ? 'text-success' : 'text-danger'}`}>
                Available: {availableCopies}
              </small>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {renderActionButtons()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`container-fluid rounded-3 shadow-lg ${isDark ? "bg-surface" : "bg-white"}`}>
        {/* Header */}
        <div className={`px-4 py-3 border-bottom ${isDark ? "border-secondary" : "border"}`}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className={`p-2 rounded ${isDark ? "bg-success bg-opacity-25" : "bg-success bg-opacity-10"}`}>
                <BookOpen size={20} className={isDark ? "text-success" : "text-success"} />
              </div>
              <div>
                <h2 className={`h4 mb-0 ${isDark ? "text-white" : "text-dark"}`}>
                  Library Collection
                </h2>
                {user && (
                  <small className="text-muted">
                    Logged in as: <span className="fw-semibold text-capitalize">{user.role}</span> - {user.name}
                  </small>
                )}
              </div>
            </div>
            
            <div className="d-flex flex-wrap align-items-center gap-3">
              <span className={`badge ${isDark ? 'bg-secondary' : 'bg-light text-dark'} px-3 py-2`}>
                Total: {filteredAndSortedBooks.length}
              </span>
              
              <div className="position-relative" style={{minWidth: '250px'}}>
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`form-control form-control-sm ps-5 ${isDark ? 'bg-dark text-white' : ''}`}
                  placeholder="Search books..."
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <Filter size={16} className="text-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`form-select form-select-sm ${isDark ? 'bg-dark text-white' : ''}`}
                >
                  <option value="title">Sort by Title</option>
                  <option value="author">Sort by Author</option>
                  <option value="recent">Sort by Recent</option>
                  <option value="available">Sort by Available</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className={`alert ${isDark ? "alert-danger bg-danger bg-opacity-10" : "alert-danger"} mb-3`}>
              {error}
            </div>
          )}
          {success && (
            <div className={`alert ${isDark ? "alert-success bg-success bg-opacity-10" : "alert-success"} mb-3`}>
              {success}
            </div>
          )}

          {loading && (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-success me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className={isDark ? "text-white-50" : "text-muted"}>
                Loading books...
              </span>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredAndSortedBooks.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                  {filteredAndSortedBooks.map((book) => (
                    <div className="col" key={book.book_id || book.id}>
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-5 rounded-3 ${isDark ? "bg-dark" : "bg-light"}`}>
                  <BookOpen size={64} className="text-muted mb-3" />
                  <h3 className={`h4 ${isDark ? "text-white" : "text-dark"} mb-2`}>No books found</h3>
                  <p className="text-muted">
                    {search ? "Try adjusting your search terms." : "No books available in the library."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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