import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Users, BookOpen, Settings, BarChart3, 
  TrendingUp, Database, UserPlus, Bell, LogOut, Activity,
  Server, AlertTriangle, CheckCircle, Clock, Eye, Lock, Trash2,
  Tag, Book, UserPlus2
} from 'lucide-react';
import AddCategory from '../category/AddCategory';
import AddBook from '../books/AddBook';
import AddStudent from '../students/AddStudent';
import AddLibrarian from '../librarian/AddLibrarian';

const AdminDashboard = ({ theme }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [addCategory, setAddCategory] = useState(false);
  const [addBook, setAddBook] = useState(false);
  const [addStudent, setAddStudent] = useState(false);
  const [addLibrarian, setAddLibrarian] = useState(false);

  const toggleAddCategory = () => setAddCategory(prev => !prev);
  const toggleAddBook = () => setAddBook(prev => !prev);
  const toggleAddStudent = () => setAddStudent(prev => !prev);
  const toggleAddLibrarian = () => setAddLibrarian(prev => !prev);

  // Sample data - replace with actual API calls
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1567,
    totalBooks: 12450,
    activeLibrarians: 8,
    dailyTransactions: 234
  });

  const [recentUsers, setRecentUsers] = useState([
    { id: 1, name: "Alice Johnson", role: "Student", joinDate: "2025-08-20", status: "active" },
    { id: 2, name: "Bob Wilson", role: "Librarian", joinDate: "2025-08-19", status: "active" },
    { id: 3, name: "Carol Smith", role: "Student", joinDate: "2025-08-18", status: "pending" },
    { id: 4, name: "David Brown", role: "Student", joinDate: "2025-08-17", status: "active" }
  ]);

  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, type: "warning", message: "Database backup overdue", time: "2 hours ago", severity: "medium" },
    { id: 2, type: "error", message: "Failed login attempts detected", time: "4 hours ago", severity: "high" },
    { id: 3, type: "info", message: "System update available", time: "1 day ago", severity: "low" },
    { id: 4, type: "success", message: "Backup completed successfully", time: "2 days ago", severity: "low" }
  ]);

  const [libraryStats, setLibraryStats] = useState([
    { branch: "Main Library", books: 8500, members: 1200, status: "active" },
    { branch: "Science Wing", books: 2200, members: 250, status: "active" },
    { branch: "Arts Section", books: 1750, members: 117, status: "maintenance" }
  ]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertBgColor = (severity) => {
    if (theme === 'dark') {
      switch (severity) {
        case 'high': return 'bg-red-900/30 border-red-700/50';
        case 'medium': return 'bg-yellow-900/30 border-yellow-700/50';
        default: return 'bg-blue-900/30 border-blue-700/50';
      }
    } else {
      switch (severity) {
        case 'high': return 'bg-red-50 border-red-200';
        case 'medium': return 'bg-yellow-50 border-yellow-200';
        default: return 'bg-blue-50 border-blue-200';
      }
    }
  };

  const getStatusBadge = (status) => {
    if (theme === 'dark') {
      switch (status) {
        case 'active': return 'bg-green-900/50 text-green-300 border border-green-700';
        case 'pending': return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700';
        case 'maintenance': return 'bg-orange-900/50 text-orange-300 border border-orange-700';
        default: return 'bg-gray-700 text-gray-300 border border-gray-600';
      }
    } else {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-700 border border-green-200';
        case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
        case 'maintenance': return 'bg-orange-100 text-orange-700 border border-orange-200';
        default: return 'bg-gray-100 text-gray-700 border border-gray-200';
      }
    }
  };

  return (
    <div className="min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            System Overview
          </h2>
          <p className={`${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Monitor and manage your library system</p>
        </div>

   
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-lg shadow-sm p-6 border backdrop-blur-sm ${
            theme === 'dark' 
              ? 'bg-gray-800/80 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Users</p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{systemStats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className={`rounded-lg shadow-sm p-6 border backdrop-blur-sm ${
            theme === 'dark' 
              ? 'bg-gray-800/80 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Books</p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{systemStats.totalBooks.toLocaleString()}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className={`rounded-lg shadow-sm p-6 border backdrop-blur-sm ${
            theme === 'dark' 
              ? 'bg-gray-800/80 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Librarians</p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{systemStats.activeLibrarians}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>  
          
          <div className={`rounded-lg shadow-sm p-6 border backdrop-blur-sm ${
            theme === 'dark' 
              ? 'bg-gray-800/80 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Daily Transactions</p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{systemStats.dailyTransactions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* System Alerts */}
          <div className={`rounded-lg shadow-sm border backdrop-blur-sm ${
            theme === 'dark' 
              ? 'bg-gray-800/80 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold flex items-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                System Alerts
              </h3>
            </div>
            <div className="p-6">
              {systemAlerts.length > 0 ? (
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className={`flex items-start space-x-3 p-3 border rounded-lg ${getAlertBgColor(alert.severity)}`}>
                      <div className="flex-shrink-0 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{alert.message}</p>
                        <p className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>No system alerts</p>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className={`rounded-lg shadow-sm border backdrop-blur-sm ${
            theme === 'dark' 
              ? 'bg-gray-800/80 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold flex items-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                Recent Users
              </h3>
            </div>
            <div className="p-6">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                      theme === 'dark' 
                        ? 'border-gray-700 bg-gray-800/50' 
                        : 'border-gray-100 bg-gray-50/50'
                    }`}>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{user.name}</h4>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{user.role}</p>
                        <p className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(user.status)}`}>
                          {user.status}
                        </span>
                        <button className={`${
                          theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'
                        }`}>
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>No recent users</p>
              )}
            </div>
          </div>
        </div>

        {/* Library Branch Stats */}
        <div className={`rounded-lg shadow-sm border backdrop-blur-sm mb-8 ${
          theme === 'dark' 
            ? 'bg-gray-800/80 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className={`p-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold flex items-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
              Library Branch Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {libraryStats.map((branch, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  theme === 'dark' 
                    ? 'border-gray-700 bg-gray-800/50' 
                    : 'border-gray-200 bg-gray-50/50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{branch.branch}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(branch.status)}`}>
                      {branch.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Books:</span>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{branch.books.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Members:</span>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{branch.members.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;