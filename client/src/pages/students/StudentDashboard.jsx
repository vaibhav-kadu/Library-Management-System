import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  Star, 
  User,
  LogOut,
  Book,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Library,
  Heart
} from 'lucide-react';

const StudentDashboard = ({ theme }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [studentStats, setStudentStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    overdue: 0,
    returnedBooks: 0
  });

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // Fetch total books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/getBooks");
      if (res.data.success) {
        const books = res.data.books || [];
        setStudentStats((prev) => ({
          ...prev,
          totalBooks: books.length
        }));
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // Fetch student transactions
  const fetchStudentTransactions = async () => {
    if (!user?.sid) return;
    
    try {
      // Assuming you have an API endpoint to get transactions by student ID
      const res = await axios.get(`http://localhost:3000/getTransactionsByStudent/${user.sid}`);
      if (res.data.success) {
        const studentTransactions = res.data.transactions || [];
        setTransactions(studentTransactions);
        calculateStudentStats(studentTransactions);
        setBorrowedBooksFromTransactions(studentTransactions);
      }
    } catch (err) {
      console.error("Error fetching student transactions:", err);
      // Fallback: calculate with mock data for demo
      calculateMockStats();
    }
  };

  // ✅ Updated statistics calculation for 4 stats only
  const calculateStudentStats = (transactions) => {
    // Filter transactions for this specific student
    const studentTransactions = transactions.filter(t => t.sid === user?.sid);

    // Count based on status
    const issuedBooks = studentTransactions.filter(t => 
      t.status === "issued" || t.status === "pending"
    ).length;

    const overdueBooks = studentTransactions.filter(t => 
      t.status === "overdue"
    ).length;

    const returnedBooks = studentTransactions.filter(t => 
      t.status === "returned"
    ).length;

    setStudentStats((prev) => ({
      ...prev,
      issuedBooks: issuedBooks,
      overdue: overdueBooks,
      returnedBooks: returnedBooks
    }));
  };

  // ✅ Fix borrowed books display (only active books - issued, pending, overdue)
  const setBorrowedBooksFromTransactions = async (transactions) => {
    // Filter for current student's active transactions
    const activeTransactions = transactions.filter(
      (t) => t.sid === user?.sid && (t.status === "issued" || t.status === "pending" || t.status === "overdue")
    );

    const borrowedBooksData = [];

    for (const transaction of activeTransactions) {
      try {
        const bookRes = await axios.get(
          `http://localhost:3000/getBook/${transaction.book_id}`
        );
        if (bookRes.data.success) {
          const book = bookRes.data.book;
          borrowedBooksData.push({
            id: transaction.transaction_id,
            bookId: book.book_id,
            title: book.title,
            author: book.author,
            dueDate: transaction.due_date,
            status: transaction.status,
            issueDate: transaction.issue_date,
            fine: transaction.fine || 0,
          });
        }
      } catch (err) {
        console.error(
          `Error fetching book details for book_id ${transaction.book_id}:`,
          err
        );
      }
    }

    setBorrowedBooks(borrowedBooksData);
  };

  // Fallback mock data calculation for demo purposes
  const calculateMockStats = () => {
    // Mock data based on your database example - for student sid = 8 (Diya Reddy)
    const mockStats = {
      issuedBooks: 0, // No currently issued books for sid = 8
      overdue: 1,     // 1 overdue book (transaction_id = 3)
      returnedBooks: 2 // 2 returned books (transaction_id = 52, 53)
    };

    const mockBorrowedBooks = [
      // Only show active books (issued/pending/overdue)
      { 
        id: 3, 
        title: "Sample Overdue Book", 
        author: "Author Name", 
        dueDate: "2025-08-26", 
        status: "overdue",
        fine: 50
      }
    ];

    setBorrowedBooks(mockBorrowedBooks);
    
    setStudentStats((prev) => ({
      ...prev,
      ...mockStats
    }));
  };

  // Fetch student's favorite books (you might need to implement this table)
  const fetchFavoriteBooks = async () => {
    // Mock favorite books data - implement according to your database schema
    const mockFavorites = [
      { id: 1, title: "The Pragmatic Programmer", author: "David Thomas", available: true },
      { id: 2, title: "Clean Code", author: "Robert Martin", available: false },
    ];
    setFavoriteBooks(mockFavorites);
  };

  useEffect(() => {
    if (user?.sid) {
      fetchBooks();
      fetchStudentTransactions();
      fetchFavoriteBooks();
    }
  }, [user]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ✅ Updated Stats config - only 4 cards
  const statsConfig = [
    {
      title: "Total Books",
      value: studentStats.totalBooks,
      icon: Library,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      onClick: () => navigate('/viewAllBooks')
    },
    {
      title: "Issued Books",
      value: studentStats.issuedBooks,
      icon: Book,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Overdue",
      value: studentStats.overdue,
      icon: AlertCircle,
      color: "red",
      bgGradient: "from-red-500 to-red-600",
      iconBg: "bg-red-100 dark:bg-red-900/30"
    },
    {
      title: "Returned Books",
      value: studentStats.returnedBooks,
      icon: CheckCircle,
      color: "indigo",
      bgGradient: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30"
    }
  ];

  // Helper function to determine book status display
  const getBookStatusInfo = (book) => {
    const currentDate = new Date();
    const dueDate = new Date(book.dueDate);
    
    if (book.status === 'overdue') {
      return {
        label: 'Overdue',
        className: 'px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full',
        icon: AlertCircle
      };
    } else if (dueDate < currentDate && book.status === 'issued') {
      return {
        label: 'Overdue',
        className: 'px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full',
        icon: AlertCircle
      };
    } else {
      return {
        label: 'Active',
        className: 'text-green-600',
        icon: CheckCircle
      };
    }
  };

  return (
    <div className="min-h-screen">
      

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1
            className={`text-4xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome back, {user?.name || "Student"}!
          </h1>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Manage your books and discover new reads with our comprehensive library system
          </p>
        </div>

        {/* Stats Cards - Updated to 4 cards in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statsConfig.map((stat, index) => (
            <div
              key={index}
              onClick={stat.onClick}
              className={`group relative overflow-hidden rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                theme === "dark"
                  ? "bg-gray-800/90 border-gray-700 backdrop-blur-sm"
                  : "bg-white/90 border-gray-200 backdrop-blur-sm"
              } ${stat.onClick ? 'cursor-pointer' : ''}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>
              <div className="relative p-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${stat.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                </div>
                <div className="space-y-2">
                  <h3
                    className={`text-sm font-semibold uppercase tracking-wider ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span
                      className={`text-4xl font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stat.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div
                  className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.bgGradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Borrowed Books */}
          <div className={`rounded-2xl shadow-lg border overflow-hidden ${
            theme === "dark"
              ? "bg-gray-800/90 border-gray-700 backdrop-blur-sm"
              : "bg-white/90 border-gray-200 backdrop-blur-sm"
          }`}>
            <div className={`p-6 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold flex items-center ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                <Book className="h-5 w-5 text-blue-600 mr-2" />
                Currently Active Books
              </h3>
            </div>
            <div className="p-6">
              {borrowedBooks.length > 0 ? (
                <div className="space-y-4">
                  {borrowedBooks.map((book) => {
                    const statusInfo = getBookStatusInfo(book);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <div key={book.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-opacity-50 ${
                        theme === "dark" 
                          ? "border-gray-600 hover:bg-gray-700" 
                          : "border-gray-200 hover:bg-gray-50"
                      }`}>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>
                            {book.title}
                          </h4>
                          <p className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}>
                            by {book.author}
                          </p>
                          <div className="flex items-center mt-2">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span className={`text-sm ${
                              book.status === 'overdue' 
                                ? 'text-red-600' 
                                : theme === "dark" ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Due: {new Date(book.dueDate).toLocaleDateString()}
                            </span>
                            {book.fine > 0 && (
                              <span className="ml-2 text-xs text-red-600 font-medium">
                                Fine: ₹{book.fine}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {statusInfo.label === 'Overdue' ? (
                            <span className={statusInfo.className}>
                              {statusInfo.label}
                            </span>
                          ) : (
                            <StatusIcon className={`h-5 w-5 ${statusInfo.className}`} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className={`text-center py-8 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  No books currently active
                </p>
              )}
            </div>
          </div>

          {/* Favorite Books */}
          <div className={`rounded-2xl shadow-lg border overflow-hidden ${
            theme === "dark"
              ? "bg-gray-800/90 border-gray-700 backdrop-blur-sm"
              : "bg-white/90 border-gray-200 backdrop-blur-sm"
          }`}>
            <div className={`p-6 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}>
              <h3 className={`text-lg font-semibold flex items-center ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                <Star className="h-5 w-5 text-yellow-600 mr-2" />
                Your Favorite Books
              </h3>
            </div>
            <div className="p-6">
              {favoriteBooks.length > 0 ? (
                <div className="space-y-4">
                  {favoriteBooks.map((book) => (
                    <div key={book.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-opacity-50 ${
                      theme === "dark" 
                        ? "border-gray-600 hover:bg-gray-700" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                          {book.title}
                        </h4>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}>
                          by {book.author}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          book.available 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {book.available ? 'Available' : 'Checked Out'}
                        </span>
                        {book.available && (
                          <button className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition-colors">
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  No favorite books yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;