import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen,  Search,  Users,  PlusCircle, 
  Edit3,   Bell,  LogOut,  Book,  AlertCircle,
  CheckCircle,  Calendar,  BarChart3,  Clock,
  UserCheck,  BookX,  TrendingUp
} from 'lucide-react';

const LibrarianDashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(5);

  // Sample data - replace with actual API calls
  const [stats, setStats] = useState({
    totalBooks: 1250,
    borrowedBooks: 340,
    overdueBooks: 23,
    activeMembers: 178,
    newMembers: 12,
    returnsToday: 8
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: "Book Borrowed", user: "John Smith", book: "JavaScript Guide", time: "2 hours ago", type: "borrow" },
    { id: 2, action: "Book Returned", user: "Sarah Johnson", book: "React Patterns", time: "3 hours ago", type: "return" },
    { id: 3, action: "New Student", user: "Mike Davis", book: "Registration", time: "5 hours ago", type: "student" },
    { id: 4, action: "Book Overdue", user: "Lisa Wilson", book: "Clean Code", time: "1 day ago", type: "overdue" },
    { id: 5, action: "Book Reserved", user: "Tom Brown", book: "System Design", time: "1 day ago", type: "reserve" }
  ]);

  const [overdueBooks, setOverdueBooks] = useState([
    { id: 1, title: "Clean Code", borrower: "Lisa Wilson", dueDate: "2025-08-20", daysOverdue: 2 },
    { id: 2, title: "Python Crash Course", borrower: "Mark Lee", dueDate: "2025-08-18", daysOverdue: 4 },
    { id: 3, title: "Data Structures", borrower: "Anna Chen", dueDate: "2025-08-15", daysOverdue: 7 }
  ]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'borrow': return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'return': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'student': return <UserCheck className="h-4 w-4 text-purple-600" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'reserve': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Book className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Librarian Portal</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800" />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'Librarian'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || 'Librarian'}!
          </h2>
          <p className="text-gray-600">Manage your library operations efficiently</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              <PlusCircle className="h-4 w-4" />
              <span>Add New Book</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Users className="h-4 w-4" />
              <span>Register Student</span>
            </button>
            <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Search className="h-4 w-4" />
              <span>Issue Book</span>
            </button>
            <button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
              <CheckCircle className="h-4 w-4" />
              <span>Return Book</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <Book className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Borrowed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.borrowedBooks}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdueBooks}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newMembers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Returns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.returnsToday}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                Recent Activities
              </h3>
            </div>
            <div className="p-6">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">
                          {activity.user} - {activity.book}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activities</p>
              )}
            </div>
          </div>

          {/* Overdue Books */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                Overdue Books
              </h3>
            </div>
            <div className="p-6">
              {overdueBooks.length > 0 ? (
                <div className="space-y-4">
                  {overdueBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{book.title}</h4>
                        <p className="text-sm text-gray-600">Borrowed by {book.borrower}</p>
                        <div className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 text-red-400 mr-1" />
                          <span className="text-sm text-red-600">
                            Due: {new Date(book.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          {book.daysOverdue} days
                        </span>
                        <button className="text-red-600 hover:text-red-800">
                          <Bell className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No overdue books</p>
              )}
            </div>
          </div>
        </div>

        {/* Management Tools */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <Book className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Book Catalog</span>
            </button>
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <Users className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Student Management</span>
            </button>
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <BarChart3 className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Reports</span>
            </button>
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <Edit3 className="h-6 w-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;