import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Shield, Users, BookOpen, Layers, BookUp, Folder 
} from 'lucide-react';

const AdminDashboard = ({ theme }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [systemStats, setSystemStats] = useState({
    totalStudents: 0,
    totalLibrarians: 0,
    totalBooks: 0,
    totalCopies: 0,
    issuedBooks: 0,
    totalCategories: 0,   // ✅ new state
  });

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/getStudents");
      if (res.data.success) {
        const students = res.data.students || [];
        setSystemStats(prev => ({ ...prev, totalStudents: students.length }));
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Fetch librarians
  const fetchLibrarians = async () => {
    try {
      const res = await axios.get("http://localhost:3000/getLibrarian");
      if (res.data.success) {
        const librarians = res.data.librarians || [];
        setSystemStats(prev => ({ ...prev, totalLibrarians: librarians.length }));
      }
    } catch (err) {
      console.error("Error fetching librarians:", err);
    }
  };

  // Fetch books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/getBooks");
      if (res.data.success) {
        const books = res.data.books || [];
        let totalCopies = 0, issuedCopies = 0;

        books.forEach(b => {
          totalCopies += b.total_copies || 0;
          issuedCopies += b.issued_copies || 0;
        });

        setSystemStats(prev => ({
          ...prev,
          totalBooks: books.length,
          totalCopies,
          issuedBooks: issuedCopies,
        }));
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/getCategory");
      if (res.data.success) {
        const categories = res.data.categories || [];
        setSystemStats(prev => ({ ...prev, totalCategories: categories.length }));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    fetchStudents();
    fetchLibrarians();
    fetchBooks();
    fetchCategories();  // ✅ load categories
  }, []);

  const statsConfig = [
    {
      title: "Total Students",
      value: systemStats.totalStudents,
      icon: Users,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      textColor: theme === "dark" ? "text-white" : "text-gray-900"
    },
    {
      title: "Total Librarians", 
      value: systemStats.totalLibrarians,
      icon: Shield,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      textColor: theme === "dark" ? "text-white" : "text-gray-900"
    },
    {
      title: "Total Books",
      value: systemStats.totalBooks,
      icon: BookOpen,
      color: "green",
      bgGradient: "from-green-500 to-green-600", 
      iconBg: "bg-green-100 dark:bg-green-900/30",
      textColor: theme === "dark" ? "text-white" : "text-gray-900"
    },
    {
      title: "Total Copies",
      value: systemStats.totalCopies,
      icon: Layers,
      color: "indigo",
      bgGradient: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      textColor: theme === "dark" ? "text-white" : "text-gray-900"
    },
    {
      title: "Issued Books",
      value: systemStats.issuedBooks,
      icon: BookUp,
      color: "orange", 
      bgGradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      textColor: theme === "dark" ? "text-white" : "text-gray-900"
    },
    {
      title: "Total Categories",   // ✅ new card
      value: systemStats.totalCategories,
      icon: Folder,
      color: "pink",
      bgGradient: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-100 dark:bg-pink-900/30",
      textColor: theme === "dark" ? "text-white" : "text-gray-900"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 mb-12">
          {statsConfig.map((stat, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                theme === 'dark' 
                  ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' 
                  : 'bg-white/90 border-gray-200 backdrop-blur-sm'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="relative p-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${stat.iconBg}`}>
                  <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                </div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${stat.textColor}`}>
                  {stat.title}
                </h3>
                <span className={`text-4xl font-bold ${stat.textColor}`}>
                  {stat.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
