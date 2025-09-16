import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Loader, Search, User, Calendar, FileText, DollarSign } from "lucide-react";
import BookDetails from "../books/BookDetails";
import StudentDetails from "../students/StudentDetails";
import LibrarianDetails from "../librarian/LibrarianDetails";
import { useAuth } from "../../context/authContext";

export default function ViewAllTransactions({ theme = "light" }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  
  // Modal states
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [showLibrarianDetails, setShowLibrarianDetails] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedLibrarianId, setSelectedLibrarianId] = useState(null);

  const isDark = theme === 'dark';

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/getAllTransactions");
      if (response.data.success) {
        setTransactions(response.data.result);
      } else {
        setError("Failed to load transactions");
      }
    } catch (err) {
      setError("Server error while fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Issue book
  const handleIssueBook = async (transactionId) => {
    if (!user.lid) {
      alert("Please log in as a librarian to issue books");
      return;
    }

    setProcessing(transactionId);
    setError(null);

    try {
      const response = await axios.put('http://localhost:3000/issueBook', {
        lid: user.lid,
        transaction_id: transactionId
      });

      if (response.data.success) {
        setSuccess("Book issued successfully!");
        setTimeout(() => setSuccess(null), 3000);
        fetchTransactions(); // Refresh data
      } else {
        setError("Failed to issue book");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to issue book");
    } finally {
      setProcessing(null);
    }
  };

  // Return book
  const handleReturnBook = async (transactionId) => {
    if (!user.lid) {
      alert("Please log in as a librarian to return books");
      return;
    }

    setProcessing(transactionId);
    setError(null);

    try {
      const response = await axios.put('http://localhost:3000/returnBook', {
        lid: user.lid,
        transaction_id: transactionId
      }); 

      if (response.data.success) {
        setSuccess("Book returned successfully!");
        setTimeout(() => setSuccess(null), 3000);
        fetchTransactions(); // Refresh data
      } else {
        setError("Failed to return book");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to return book");
    } finally {
      setProcessing(null);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return isDark 
          ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
          : 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'issued':
        return isDark 
          ? 'bg-blue-600/20 text-blue-400 border-blue-600/30'
          : 'bg-blue-100 text-blue-800 border-blue-300';
      case 'returned':
        return isDark 
          ? 'bg-green-600/20 text-green-400 border-green-600/30'
          : 'bg-green-100 text-green-800 border-green-300';
      case 'overdue':
        return isDark 
          ? 'bg-red-600/20 text-red-400 border-red-600/30'
          : 'bg-red-100 text-red-800 border-red-300';
      default:
        return isDark 
          ? 'bg-gray-600/20 text-gray-400 border-gray-600/30'
          : 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle modal clicks
  const handleBookClick = (bookId) => {
    setSelectedBookId(bookId);
    setShowBookDetails(true);
  };

  const handleStudentClick = (sid) => {
    setSelectedStudentId(sid);
    setShowStudentDetails(true);
  };

  const handleLibrarianClick = (lid) => {    
    setSelectedLibrarianId(lid);
    setShowLibrarianDetails(true);
  };

  // Search filter
  const filteredTransactions = transactions.filter(transaction =>
    transaction.student_name.toLowerCase().includes(search.toLowerCase()) ||
    transaction.book_name.toLowerCase().includes(search.toLowerCase()) ||
    (transaction.issued_by && transaction.issued_by.toLowerCase().includes(search.toLowerCase())) ||
    (transaction.return_to && transaction.return_to.toLowerCase().includes(search.toLowerCase())) ||
    transaction.status.toLowerCase().includes(search.toLowerCase()) ||
    transaction.transaction_id.toString().includes(search)
  );

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'id':
        return b.transaction_id - a.transaction_id;
      case 'issue_date':
        if (!a.issue_date && !b.issue_date) return 0;
        if (!a.issue_date) return 1;
        if (!b.issue_date) return -1;
        return new Date(b.issue_date) - new Date(a.issue_date);
      case 'due_date':
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      case 'pending':
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
      case 'issued':
        if (a.status === 'issued' && b.status !== 'issued') return -1;
        if (a.status !== 'issued' && b.status === 'issued') return 1;
        return 0;
      case 'returned':
        if (a.status === 'returned' && b.status !== 'returned') return -1;
        if (a.status !== 'returned' && b.status === 'returned') return 1;
        return 0;
      case 'overdue':
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (a.status !== 'overdue' && b.status === 'overdue') return 1;
        return 0;
      default:
        return 0;
    }
  });

  return (
    <>
      <div className={`max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`px-6 py-3 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-blue-600/20" : "bg-blue-100"
              }`}>
                <FileText className={`w-5 h-5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`} />
              </div>
              <h2 className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                All Transactions
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                Total: {filteredTransactions.length}
              </div>
              
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="id">Sort by ID</option>
                <option value="issue_date">Sort by Issue Date</option>
                <option value="due_date">Sort by Due Date</option>
                <option value="pending">Pending First</option>
                <option value="issued">Issued First</option>
                <option value="returned">Returned First</option>
                <option value="overdue">Overdue First</option>
              </select>

              {/* Search Bar */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Search transactions..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Error / Success */}
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
                isDark ? "text-blue-400" : "text-blue-500"
              }`} />
              <span className={`ml-2 text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                Loading transactions...
              </span>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className={`rounded-lg border overflow-x-auto ${
              isDark ? "border-gray-600" : "border-gray-300"
            }`}>
              <table className="w-full">
                <thead className={isDark ? "bg-gray-700/50" : "bg-gray-50"}>
                  <tr className={`border-b ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                    {[
                      'ID',
                      'Student Name',
                      'Book Name',
                      'Issued By',
                      'Issue Date',
                      'Due Date',
                      'Return To',
                      'Return Date',
                      'Status',
                      'Fine'
                    ].map((header, index) => (
                      <th
                        key={header}
                        className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          index < 9 ? 'border-r' : ''
                        } ${
                          isDark ? "text-gray-300 border-gray-600" : "text-gray-700 border-gray-300"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-600" : "divide-gray-300"}`}>
                  {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((transaction) => (
                      <tr
                        key={transaction.transaction_id}
                        className={`transition-colors border-b ${
                          isDark
                            ? "hover:bg-gray-700/30 border-gray-600"
                            : "hover:bg-gray-50 border-gray-300"
                        }`}
                      >
                        <td className={`py-3 px-4 text-sm font-medium border-r ${
                          isDark ? "text-gray-300 border-gray-600" : "text-gray-900 border-gray-300"
                        }`}>
                          {transaction.transaction_id}
                        </td>
                        
                        <td className={`py-3 px-4 border-r ${
                          isDark ? "border-gray-600" : "border-gray-300"
                        }`}>
                          <button
                            onClick={() => handleStudentClick(transaction.sid)}
                            className={`text-sm font-medium hover:underline transition-colors ${
                              isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                            }`}
                          >
                            {transaction.student_name}
                          </button>
                        </td>
                        
                        <td className={`py-3 px-4 border-r ${
                          isDark ? "border-gray-600" : "border-gray-300"
                        }`}>
                          <button
                            onClick={() => handleBookClick(transaction.book_id)}
                            className={`text-sm font-medium hover:underline transition-colors ${
                              isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                            }`}
                          >
                            {transaction.book_name}
                          </button>
                        </td>
                        
                        <td className={`py-3 px-4 border-r ${
                          isDark ? "border-gray-600" : "border-gray-300"
                        }`}>
                          {transaction.issued_by ? (
                            <button
                              onClick={() => handleLibrarianClick(transaction.issue_lid)}
                              className={`text-sm hover:underline transition-colors ${
                                isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                              }`}
                            >
                              {transaction.issued_by}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleIssueBook(transaction.transaction_id)}
                              disabled={processing === transaction.transaction_id}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                isDark
                                  ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/30'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                              } ${processing === transaction.transaction_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {processing === transaction.transaction_id ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                'Issue'
                              )}
                            </button>
                          )}
                        </td>
                        
                        <td className={`py-3 px-4 text-sm border-r ${
                          isDark ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-300"
                        }`}>
                          {formatDate(transaction.issue_date)}
                        </td>
                        
                        <td className={`py-3 px-4 text-sm border-r ${
                          isDark ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-300"
                        }`}>
                          {formatDate(transaction.due_date)}
                        </td>
                        
                        <td className={`py-3 px-4 border-r ${
                          isDark ? "border-gray-600" : "border-gray-300"
                        }`}>
                          {transaction.return_to ? (
                            <button
                              onClick={() => handleLibrarianClick(transaction.return_lid)}
                              className={`text-sm hover:underline transition-colors ${
                                isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                              }`}
                            >
                              {transaction.return_to}
                            </button>
                          ) : transaction.issued_by ? (
                            <button
                              onClick={() => handleReturnBook(transaction.transaction_id)}
                              disabled={processing === transaction.transaction_id}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                isDark
                                  ? 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 border border-orange-600/30'
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
                              } ${processing === transaction.transaction_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {processing === transaction.transaction_id ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                'Return'
                              )}
                            </button>
                          ) : (
                            <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              -
                            </span>
                          )}
                        </td>
                        
                        <td className={`py-3 px-4 text-sm border-r ${
                          isDark ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-300"
                        }`}>
                          {formatDate(transaction.return_date)}
                        </td>
                        
                        <td className={`py-3 px-4 border-r ${
                          isDark ? "border-gray-600" : "border-gray-300"
                        }`}>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        
                        <td className={`py-3 px-4 text-sm ${
                          isDark ? "text-gray-200" : "text-gray-800"
                        }`}>
                          {transaction.fine > 0 ? (
                            <span className={`font-medium ${
                              isDark ? "text-red-400" : "text-red-600"
                            }`}>
                              ₹{transaction.fine}
                            </span>
                          ) : (
                            <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                              ₹0
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className={`text-center py-12 text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modals */}
      {showBookDetails && (
        <BookDetails
          bookId={selectedBookId}
          onClose={() => setShowBookDetails(false)}
          theme={theme}
        />
      )}

      {showStudentDetails && (
        <StudentDetails
          studentId={selectedStudentId}
          onClose={() => setShowStudentDetails(false)}
          theme={theme}
        />
      )}

      {showLibrarianDetails && (
        <LibrarianDetails
          librarianId={selectedLibrarianId}
          onClose={() => setShowLibrarianDetails(false)}
          theme={theme}
        />
      )}
    </>
  );
}