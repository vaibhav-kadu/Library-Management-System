import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  ChevronDown, 
  BookOpen,
  Menu,
  X,
  Home,
  UserPlus,
  LogIn,
  Plus,
  Eye,
  Users,
  Library,
  Edit3,
  Trash2,
  Tag
} from 'lucide-react';

const Navbar = ({ theme, setTheme, onLoginClick }) => {
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const dropdownRefs = useRef({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          setOpenDropdowns(prev => ({ ...prev, [key]: false }));
        }
      });
      
      if (dropdownRefs.current.profile && !dropdownRefs.current.profile.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdowns({});
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Role Badge Component
  const RoleBadge = ({ role }) => {
    const getRoleStyles = () => {
      switch(role) {
        case 'admin':
          return theme === 'dark' 
            ? 'bg-purple-900 text-purple-300 border-purple-700' 
            : 'bg-purple-100 text-purple-800 border-purple-300';
        case 'librarian':
          return theme === 'dark'
            ? 'bg-green-900 text-green-300 border-green-700'
            : 'bg-green-100 text-green-800 border-green-300';
        case 'student':
          return theme === 'dark'
            ? 'bg-blue-900 text-blue-300 border-blue-700'
            : 'bg-blue-100 text-blue-800 border-blue-300';
        default:
          return theme === 'dark'
            ? 'bg-gray-700 text-gray-300 border-gray-600'
            : 'bg-gray-100 text-gray-800 border-gray-300';
      }
    };

    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getRoleStyles()}`}>
        {role?.toUpperCase()}
      </span>
    );
  };

  // Dropdown Menu Component
  const DropdownMenu = ({ title, icon: Icon, items, dropdownKey, isMobile = false }) => (
    <div className={`relative ${isMobile ? 'w-full' : ''}`} ref={el => dropdownRefs.current[dropdownKey] = el}>
      <button
        onClick={() => toggleDropdown(dropdownKey)}
        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isMobile ? 'w-full justify-between' : ''
        } ${
          theme === 'dark'
            ? 'hover:bg-gray-700 hover:text-white text-gray-300'
            : 'hover:bg-gray-100 hover:text-gray-900 text-gray-700'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${openDropdowns[dropdownKey] ? 'rotate-180' : ''}`} />
      </button>
      
      {openDropdowns[dropdownKey] && (
        <div className={`${isMobile ? 'relative mt-1 ml-6' : 'absolute left-0 mt-2'} w-48 rounded-lg shadow-lg border z-50 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                setOpenDropdowns(prev => ({ ...prev, [dropdownKey]: false }));
                if (isMobile) setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              } ${index === 0 ? 'rounded-t-lg' : ''} ${index === items.length - 1 ? 'rounded-b-lg' : ''}`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Navigation items based on user role
  const getNavigationItems = (isMobile = false) => {
    const commonButtonClasses = `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isMobile ? 'w-full' : ''
    } ${
      theme === 'dark'
        ? 'hover:bg-gray-700 hover:text-white text-gray-300'
        : 'hover:bg-gray-100 hover:text-gray-900 text-gray-700'
    }`;

    if (!user) {
      // Not logged in - Home, Books, Login, Signup, theme toggle
      return (
        <>
          <button
            onClick={() => {
              navigate('/');
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={commonButtonClasses}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              navigate('/viewAllBooks');
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={commonButtonClasses}
          >
            <BookOpen className="h-4 w-4" />
            <span>Books</span>
          </button>
        </>
      );
    }

    const dashboardPath = user.role === 'admin' ? '/admin-dashboard' 
      : user.role === 'librarian' ? '/librarian-dashboard' 
      : '/student-dashboard';

    const dashboardButton = (
      <button
        onClick={() => {
          navigate(dashboardPath);
          if (isMobile) setMobileMenuOpen(false);
        }}
        className={commonButtonClasses}
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </button>
    );

    // Student navigation - Dashboard, Books
    if (user.role === 'student') {
      return (
        <>
          {dashboardButton}
          <button
            onClick={() => {
              navigate('/viewAllBooks');
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={commonButtonClasses}
          >
            <BookOpen className="h-4 w-4" />
            <span>Books</span>
          </button>
        </>
      );
    }

    // Librarian navigation - Dashboard, Books(dropdown), Students(dropdown)
    if (user.role === 'librarian') {
      return (
        <>
          {dashboardButton}
          <DropdownMenu
            title="Books"
            icon={BookOpen}
            dropdownKey={`books-${isMobile ? 'mobile' : 'desktop'}`}
            isMobile={isMobile}
            items={[
              { label: 'Add Book', path: '/addBook', icon: Plus },
              { label: 'View Books', path: '/viewAllBooks', icon: Eye },
              { label: 'Update Book', path: '/updateBook', icon: Edit3 },
              { label: 'Delete Book', path: '/deleteBook', icon: Trash2 }
            ]}
          />
          <DropdownMenu
            title="Students"
            icon={Users}
            dropdownKey={`students-${isMobile ? 'mobile' : 'desktop'}`}
            isMobile={isMobile}
            items={[
              { label: 'Add Student', path: '/addStudents', icon: Plus },
              { label: 'View Students', path: '/viewStudents', icon: Eye },
              { label: 'Update Student', path: '/updateStudent', icon: Edit3 },
              { label: 'Delete Student', path: '/deleteStudent', icon: Trash2 }
            ]}
          />
        </>
      );
    }

    // Admin navigation - Dashboard, Books(dropdown), Category(dropdown), Students(dropdown), Librarians(dropdown)
    if (user.role === 'admin') {
      return (
        <>
          {dashboardButton}
          <DropdownMenu
            title="Books"
            icon={BookOpen}
            dropdownKey={`books-${isMobile ? 'mobile' : 'desktop'}`}
            isMobile={isMobile}
            items={[
              { label: 'Add Book', path: '/addBook', icon: Plus },
              { label: 'View Books', path: '/viewAllBooks', icon: Eye },
              { label: 'Update Book', path: '/updateBook', icon: Edit3 },
              { label: 'Delete Book', path: '/deleteBook', icon: Trash2 }
            ]}
          />
          <DropdownMenu
            title="Category"
            icon={Tag}
            dropdownKey={`category-${isMobile ? 'mobile' : 'desktop'}`}
            isMobile={isMobile}
            items={[
              { label: 'Add Category', path: '/addCategory', icon: Plus },
              { label: 'View Categories', path: '/viewCategory', icon: Eye },
              { label: 'Update Category', path: '/updateCategory', icon: Edit3 },
              { label: 'Delete Category', path: '/deleteCategory', icon: Trash2 }
            ]}
          />
          <DropdownMenu
            title="Students"
            icon={Users}
            dropdownKey={`students-${isMobile ? 'mobile' : 'desktop'}`}
            isMobile={isMobile}
            items={[
              { label: 'Add Student', path: '/addStudents', icon: Plus },
              { label: 'View Students', path: '/viewStudents', icon: Eye },
              { label: 'Update Student', path: '/updateStudent', icon: Edit3 },
              { label: 'Delete Student', path: '/deleteStudent', icon: Trash2 }
            ]}
          />
          <DropdownMenu
            title="Librarians"
            icon={Library}
            dropdownKey={`librarians-${isMobile ? 'mobile' : 'desktop'}`}
            isMobile={isMobile}
            items={[
              { label: 'Add Librarian', path: '/addLibrarian', icon: Plus },
              { label: 'View Librarians', path: '/viewLibrarians', icon: Eye },
              { label: 'Update Librarian', path: '/updateLibrarian', icon: Edit3 },
              { label: 'Delete Librarian', path: '/deleteLibrarian', icon: Trash2 }
            ]}
          />
        </>
      );
    }

    return null;
  };

  return (
    <nav className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900/95 border-gray-700 text-white' 
        : 'bg-white/95 border-gray-200 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title - Same for all */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
            <img
              src="/lms.png"
              alt="LMS Logo"
              className="w-12 h-12 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-500 group-hover:rotate-3"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Library Management
              </span>
              <span className={`text-xs font-semibold tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                SYSTEM
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {getNavigationItems(false)}
          </div>

          {/* Right Side - User Info & Theme Toggle */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-yellow-400 hover:text-yellow-300'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Section */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                {/* Role Badge */}
                <RoleBadge role={user.role} />
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={el => dropdownRefs.current.profile = el}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {/* User Avatar */}
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt={user.name || 'User'}
                        className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(user.name || user.email)}
                      </div>
                    )}
                    
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{user.name || 'User'}</span>
                    
                    <ChevronDown className={`h-4 w-4 transition-transform ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    } ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {dropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-center space-x-3 transition-colors duration-200 ${
                            theme === 'dark' ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                          }`}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={onLoginClick}
                  className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={onLoginClick}
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-md transition-colors duration-200 ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t py-4 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="space-y-2 px-2">
              {!user ? (
                <>
                  {/* Mobile Navigation for non-logged users */}
                  {getNavigationItems(true)}
                  
                  {/* Mobile Login/Signup */}
                  <div className={`border-t pt-2 mt-2 space-y-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => {
                        onLoginClick();
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'text-blue-400 hover:bg-gray-700'
                          : 'text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => {
                        onLoginClick();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile Role Badge */}
                  <div className="px-3 py-2 flex items-center space-x-2">
                    <RoleBadge role={user.role} />
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{user.name || 'User'}</span>
                  </div>
                  
                  {/* Mobile Navigation Items */}
                  {getNavigationItems(true)}
                  
                  {/* Mobile Logout */}
                  <div className={`border-t pt-2 mt-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 transition-colors duration-200 ${
                        theme === 'dark' ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;