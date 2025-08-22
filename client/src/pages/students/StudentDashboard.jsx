import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
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
  Library
} from 'lucide-react';
import ViewAllBooks from '../books/ViewAllBooks';
import StudentProfile from './StudentProfile ';

const StudentDashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Sample data - replace with actual API calls
  const [borrowedBooks, setBorrowedBooks] = useState([
    { id: 1, title: "JavaScript: The Good Parts", author: "Douglas Crockford", dueDate: "2025-08-30", status: "active" },
    { id: 2, title: "Clean Code", author: "Robert Martin", dueDate: "2025-08-25", status: "overdue" },
    { id: 3, title: "React Design Patterns", author: "John Smith", dueDate: "2025-09-05", status: "active" }
  ]);

  const [favoriteBooks, setFavoriteBooks] = useState([
    { id: 4, title: "The Pragmatic Programmer", author: "David Thomas", available: true },
    { id: 5, title: "System Design Interview", author: "Alex Xu", available: false },
    { id: 6, title: "Data Structures and Algorithms", author: "Narasimha Karumanchi", available: true }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Library Portal</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">              
              <div onClick={()=>navigate('/student-profile')} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'Student'}
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
            Welcome back, {user?.name || 'Student'}!
          </h2>
          <p className="text-gray-600">Manage your books and discover new reads</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">View All Books</p>
                <p className="text-2xl font-bold text-gray-900">100</p>
              </div>
              <Library className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Books Borrowed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {borrowedBooks.length}
                </p>
              </div>
              <Book className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {borrowedBooks.filter(book => new Date(book.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {borrowedBooks.filter(book => book.status === 'overdue').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Borrowed Books */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Book className="h-5 w-5 text-blue-600 mr-2" />
                Currently Borrowed Books
              </h3>
            </div>
            <div className="p-6">
              {borrowedBooks.length > 0 ? (
                <div className="space-y-4">
                  {borrowedBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{book.title}</h4>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <div className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className={`text-sm ${book.status === 'overdue' ? 'text-red-600' : 'text-gray-600'}`}>
                            Due: {new Date(book.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {book.status === 'overdue' ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            Overdue
                          </span>
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No books currently borrowed</p>
              )}
            </div>
          </div>

          {/* Favorite Books */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Star className="h-5 w-5 text-yellow-600 mr-2" />
                Your Favorite Books
              </h3>
            </div>
            <div className="p-6">
              {favoriteBooks.length > 0 ? (
                <div className="space-y-4">
                  {favoriteBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{book.title}</h4>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          book.available 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {book.available ? 'Available' : 'Checked Out'}
                        </span>
                        {book.available && (
                          <button className="text-blue-600 hover:text-blue-800">
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No favorite books yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ViewAllBooks/>
    </div>
  );
};

export default StudentDashboard;