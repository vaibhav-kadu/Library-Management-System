import React, { useState, useEffect } from 'react';
import { User, BookOpen, Shield, Eye, EyeOff, Plus, Edit, Trash2, Search, LogOut, Users, Book, Calendar, TrendingUp } from 'lucide-react';
import '../auth/login.css';

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [userType, setUserType] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'Fiction', status: 'Available', publishedYear: 2004 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', category: 'Fiction', status: 'Borrowed', publishedYear: 1960 },
    { id: 3, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', isbn: '978-0-596-51774-8', category: 'Technology', status: 'Available', publishedYear: 2008 },
    { id: 4, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0-13-235088-4', category: 'Technology', status: 'Available', publishedYear: 2008 },
    { id: 5, title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', category: 'Dystopian', status: 'Borrowed', publishedYear: 1949 }
  ]);

  const handleLogin = (type) => {
    setUserType(type);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentView('login');
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setCurrentView('bookDetails');
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setCurrentView('addBook');
  };

  const handleDeleteBook = (bookId) => {
    setBooks(books.filter(book => book.id !== bookId));
  };

  const handleAddBook = (bookData) => {
    if (selectedBook) {
      // Edit existing book
      setBooks(books.map(book => 
        book.id === selectedBook.id ? { ...book, ...bookData } : book
      ));
    } else {
      // Add new book
      const newBook = {
        ...bookData,
        id: Date.now(),
        status: 'Available'
      };
      setBooks([...books, newBook]);
    }
    setSelectedBook(null);
    setCurrentView('viewBooks');
  };

  const renderCurrentView = () => {
    switch(currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard userType={userType} onNavigate={setCurrentView} books={books} />;
      case 'addBook':
        return <AddBookForm onSubmit={handleAddBook} book={selectedBook} onCancel={() => {setSelectedBook(null); setCurrentView('viewBooks');}} />;
      case 'viewBooks':
        return <ViewBooks books={books} onView={handleViewBook} onEdit={handleEditBook} onDelete={handleDeleteBook} userType={userType} onNavigate={setCurrentView} />;
      case 'bookDetails':
        return <BookDetails book={selectedBook} onBack={() => setCurrentView('viewBooks')} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {currentView !== 'login' && (
        <Header userType={userType} onLogout={handleLogout} onNavigate={setCurrentView} />
      )}
      {renderCurrentView()}
    </div>
  );
};

// Header Component
const Header = ({ userType, onLogout, onNavigate }) => {
  return (
    <header className="bg-white shadow-lg border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LibraryHub
              </h1>
              <p className="text-sm text-gray-500 capitalize">{userType} Portal</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Dashboard
            </button>
            <button onClick={() => onNavigate('viewBooks')} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Books
            </button>
            {(userType === 'librarian' || userType === 'admin') && (
              <button onClick={() => onNavigate('addBook')} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Add Book
              </button>
            )}
          </nav>

          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// Login Form Component (Class Component)
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUserType: null,
      credentials: {
        username: '',
        password: ''
      },
      showPassword: false,
      isLoading: false
    };
  }

  handleUserTypeSelect = (userType) => {
    this.setState({ selectedUserType: userType });
  };

  handleInputChange = (field, value) => {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [field]: value
      }
    });
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    
    // Simulate API call
    setTimeout(() => {
      this.setState({ isLoading: false });
      this.props.onLogin(this.state.selectedUserType);
    }, 1500);
  };

  render() {
    const { selectedUserType, credentials, showPassword, isLoading } = this.state;

    const userTypes = [
      {
        type: 'student',
        title: 'Student Portal',
        icon: User,
        description: 'Browse and borrow books',
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-50 to-cyan-50'
      },
      {
        type: 'librarian',
        title: 'Librarian Portal',
        icon: BookOpen,
        description: 'Manage books and users',
        gradient: 'from-green-500 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-50'
      },
      {
        type: 'admin',
        title: 'Admin Portal',
        icon: Shield,
        description: 'Full system control',
        gradient: 'from-purple-500 to-indigo-500',
        bgGradient: 'from-purple-50 to-indigo-50'
      }
    ];

    if (!selectedUserType) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-12">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                LibraryHub
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your comprehensive library management solution. Choose your portal to get started.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {userTypes.map((userType) => {
                const IconComponent = userType.icon;
                return (
                  <div
                    key={userType.type}
                    onClick={() => this.handleUserTypeSelect(userType.type)}
                    className={`bg-gradient-to-br ${userType.bgGradient} p-8 rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/50 backdrop-blur-sm`}
                  >
                    <div className={`bg-gradient-to-r ${userType.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
                      {userType.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {userType.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    const currentUserType = userTypes.find(ut => ut.type === selectedUserType);
    const IconComponent = currentUserType.icon;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className={`bg-gradient-to-r ${currentUserType.gradient} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{currentUserType.title}</h2>
              <p className="text-gray-600 mt-2">Sign in to continue</p>
            </div>

            <form onSubmit={this.handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => this.handleInputChange('username', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={credentials.password}
                    onChange={(e) => this.handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => this.setState({ showPassword: !showPassword })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${currentUserType.gradient} text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => this.setState({ selectedUserType: null })}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Choose different portal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Dashboard Component (Functional Component)
const Dashboard = ({ userType, onNavigate, books }) => {
  const [stats, setStats] = useState({
    totalBooks: books.length,
    availableBooks: books.filter(book => book.status === 'Available').length,
    borrowedBooks: books.filter(book => book.status === 'Borrowed').length,
    totalUsers: 156
  });

  const getWelcomeMessage = () => {
    const messages = {
      student: "Welcome back! Ready to explore new books?",
      librarian: "Manage your library efficiently today.",
      admin: "Full system overview and control at your fingertips."
    };
    return messages[userType];
  };

  const getDashboardCards = () => {
    const baseCards = [
      {
        title: 'Total Books',
        value: stats.totalBooks,
        icon: Book,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-blue-100'
      },
      {
        title: 'Available Books',
        value: stats.availableBooks,
        icon: BookOpen,
        color: 'from-green-500 to-green-600',
        bgColor: 'from-green-50 to-green-100'
      }
    ];

    const librarianAdminCards = [
      {
        title: 'Borrowed Books',
        value: stats.borrowedBooks,
        icon: Calendar,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'from-orange-50 to-orange-100'
      },
      {
        title: 'Total Users',
        value: stats.totalUsers,
        icon: Users,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'from-purple-50 to-purple-100'
      }
    ];

    return userType === 'student' ? baseCards : [...baseCards, ...librarianAdminCards];
  };

  const quickActions = [
    {
      title: 'Browse Books',
      description: 'View all available books in the library',
      icon: Search,
      action: () => onNavigate('viewBooks'),
      color: 'from-indigo-500 to-purple-500'
    },
    ...(userType !== 'student' ? [{
      title: 'Add New Book',
      description: 'Add a new book to the library collection',
      icon: Plus,
      action: () => onNavigate('addBook'),
      color: 'from-green-500 to-emerald-500'
    }] : [])
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">
          {userType} Dashboard
        </h1>
        <p className="text-gray-600 text-lg">{getWelcomeMessage()}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getDashboardCards().map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${card.bgColor} p-6 rounded-2xl border border-white/50`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${card.color} p-3 rounded-xl`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div
                key={index}
                onClick={action.action}
                className="p-6 border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer transition-all transform hover:scale-105 hover:border-indigo-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`bg-gradient-to-r ${action.color} p-3 rounded-lg flex-shrink-0`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity (for librarian/admin) */}
      {userType !== 'student' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Book borrowed', book: 'The Great Gatsby', user: 'John Doe', time: '2 hours ago' },
              { action: 'New book added', book: 'Clean Architecture', user: 'System', time: '4 hours ago' },
              { action: 'Book returned', book: 'JavaScript Guide', user: 'Jane Smith', time: '6 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-600">"{activity.book}" by {activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Add Book Form Component (Class Component)
class AddBookForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        title: '',
        author: '',
        isbn: '',
        category: '',
        publishedYear: '',
        description: ''
      },
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.book) {
      this.setState({
        formData: {
          title: this.props.book.title || '',
          author: this.props.book.author || '',
          isbn: this.props.book.isbn || '',
          category: this.props.book.category || '',
          publishedYear: this.props.book.publishedYear || '',
          description: this.props.book.description || ''
        }
      });
    }
  }

  handleInputChange = (field, value) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [field]: value
      },
      errors: {
        ...this.state.errors,
        [field]: ''
      }
    });
  };

  validateForm = () => {
    const { formData } = this.state;
    const errors = {};

    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    if (!formData.isbn.trim()) errors.isbn = 'ISBN is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.publishedYear.trim()) errors.publishedYear = 'Published Year is required';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      this.props.onSubmit(this.state.formData);
    }
  };

  render() {
    const { formData, errors } = this.state;
    const { book, onCancel } = this.props;
    const isEditing = !!book;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isEditing ? 'Edit Book' : 'Add New Book'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update book information' : 'Fill in the details to add a new book to the library'}
            </p>
          </div>

          <form onSubmit={this.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => this.handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter book title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => this.handleInputChange('author', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.author ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter author name"
                />
                {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN *
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => this.handleInputChange('isbn', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.isbn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter ISBN"
                />
                {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => this.handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Technology">Technology</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Dystopian">Dystopian</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Published Year *
                </label>
                <input
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) => this.handleInputChange('publishedYear', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.publishedYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter published year"
                  min="1000"
                  max="2024"
                />
                {errors.publishedYear && <p className="text-red-500 text-sm mt-1">{errors.publishedYear}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => this.handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter book description (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                {isEditing ? 'Update Book' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// View Books Component (Functional Component)
const ViewBooks = ({ books, onView, onEdit, onDelete, userType, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const categories = [...new Set(books.map(book => book.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || book.category === filterCategory;
    const matchesStatus = !filterStatus || book.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Library Books</h1>
            <p className="text-gray-600">Browse and manage the library collection</p>
          </div>
          {(userType === 'librarian' || userType === 'admin') && (
            <button
              onClick={() => onNavigate('addBook')}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Book</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Books</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all transform hover:scale-105">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  book.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.status}
                </div>
                <div className="flex space-x-2">
                  {(userType === 'librarian' || userType === 'admin') && (
                    <>
                      <button
                        onClick={() => onEdit(book)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Book"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(book.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{book.title}</h3>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <p className="text-sm text-gray-500 mb-4">{book.category} • {book.publishedYear}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ISBN:</span>
                  <span className="text-gray-700 font-mono">{book.isbn}</span>
                </div>
              </div>

              <button
                onClick={() => onView(book)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

// Book Details Component (Functional Component)
const BookDetails = ({ book, onBack }) => {
  if (!book) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
          >
            <span>←</span>
            <span>Back to Books</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover Placeholder */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 text-center aspect-[3/4] flex items-center justify-center">
                <div>
                  <BookOpen className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                  <p className="text-indigo-800 font-medium">Book Cover</p>
                </div>
              </div>
            </div>

            {/* Book Information */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  book.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.status}
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
                <p className="text-lg text-gray-500">{book.category} • Published {book.publishedYear}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">ISBN</h3>
                  <p className="font-mono text-gray-900">{book.isbn}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Availability</h3>
                  <p className={`font-medium ${
                    book.status === 'Available' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {book.status}
                  </p>
                </div>
              </div>

              {book.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="flex space-x-4">
                {book.status === 'Available' && (
                  <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105">
                    Borrow Book
                  </button>
                )}
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-all">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Category</p>
                <p className="font-medium text-gray-900">{book.category}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Publication Year</p>
                <p className="font-medium text-gray-900">{book.publishedYear}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Current Status</p>
                <p className={`font-medium ${
                  book.status === 'Available' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {book.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;