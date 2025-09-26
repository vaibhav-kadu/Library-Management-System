import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
const BASE_URL = import.meta.env.VITE_API_URL;
import {
  BookOpen, Users, Book, AlertCircle,
  CheckCircle, Clock
} from 'lucide-react';

const LibrarianDashboard = ({ theme }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [librarianStats, setLibrarianStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    overdueBooks: 0,
    activeMembers: 0,
    pendingBooks: 0,
    returnedBooks: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // ✅ Fetch totalBooks
  const fetchBooks = async () => {
    try {
      const res = await api.get('/getBooks');
      if (res.data.success) {
        const books = res.data.books || [];
        setLibrarianStats((prev) => ({
          ...prev,
          totalBooks: books.length
        }));
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // ✅ Fetch total students
  const fetchStudents = async () => {
    try {
      const res = await api.get('/getStudents');
      if (res.data.success) {
        const students = res.data.students || [];
        setLibrarianStats((prev) => ({
          ...prev,
          activeMembers: students.length
        }));
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // ✅ Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await api.get('/getAllTransactions');
      if (res.data.success) {
        const transactions = res.data.result || [];

        const issuedCount = transactions.filter((t) => t.status === "issued").length;
        const overdueCount = transactions.filter((t) => t.status === "overdue").length;
        const pendingCount = transactions.filter((t) => t.status === "pending").length;
        const returnedCount = transactions.filter((t) => t.status === "returned").length;

        setLibrarianStats((prev) => ({
          ...prev,
          issuedBooks: issuedCount,
          overdueBooks: overdueCount,
          pendingBooks: pendingCount,
          returnedBooks: returnedCount
        }));
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStudents();
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // ✅ Stats config
  const statsConfig = [
    {
      title: "Total Books",
      value: librarianStats.totalBooks,
      icon: Book,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Issued Books",
      value: librarianStats.issuedBooks,
      icon: BookOpen,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Overdue Books",
      value: librarianStats.overdueBooks,
      icon: AlertCircle,
      color: "red",
      bgGradient: "from-red-500 to-red-600",
      iconBg: "bg-red-100 dark:bg-red-900/30"
    },
    {
      title: "Active Students",
      value: librarianStats.activeMembers,
      icon: Users,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Pending Books",
      value: librarianStats.pendingBooks,
      icon: Clock,
      color: "yellow",
      bgGradient: "from-yellow-500 to-yellow-600",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      title: "Returned Books",
      value: librarianStats.returnedBooks,
      icon: CheckCircle,
      color: "indigo",
      bgGradient: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* ✅ Removed the "Librarian Portal" header */}

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1
            className={`text-4xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome, {user?.name || "Librarian"}!
          </h1>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Manage your library operations efficiently with comprehensive tools
            and insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {statsConfig.map((stat, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                theme === "dark"
                  ? "bg-gray-800/90 border-gray-700 backdrop-blur-sm"
                  : "bg-white/90 border-gray-200 backdrop-blur-sm"
              }`}
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
      </div>
    </div>
  );
};

export default LibrarianDashboard;
