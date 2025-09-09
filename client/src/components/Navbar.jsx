import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { 
  Sun, Moon, 
  User, BookUp, BookDown, History, 
  LogOut, Clock, AlertCircle,
  ChevronDown, DollarSign, Calendar, FileText,
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
  Tag,
  ArrowRightLeft,
  ChevronRight
} from 'lucide-react';

const Navbar = ({ 
  theme, 
  setTheme, 
  onLoginClick, 
  onSignUpClick,
  onDropdownItemClick,
  customDropdownHandlers = {}
}) => {
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRefs = useRef({});

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRefs.current.profile && !dropdownRefs.current.profile.contains(event.target)) {
        setDropdownOpen(false);
      }
      let shouldCloseAny = false;
      Object.keys(openDropdowns).forEach(key => {
        const ref = dropdownRefs.current[key];
        if (ref && !ref.contains(event.target)) {
          shouldCloseAny = true;
        }
      });
      if (shouldCloseAny) setOpenDropdowns({});
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdowns]);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    setOpenDropdowns({});
    setDropdownOpen(false);
  }, [location, isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    if (isMobile) setSidebarOpen(false);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = (key) => setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  const closeAllDropdowns = () => { setOpenDropdowns({}); setDropdownOpen(false); };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleDropdownItemClick = (item) => {
    if (onDropdownItemClick) onDropdownItemClick(item);
    else navigate(item.path);
    closeAllDropdowns();
    if (isMobile) setSidebarOpen(false);
  };

  // Role Badge
  const RoleBadge = ({ role }) => {
    const styles = {
      admin: theme === 'dark' ? 'bg-purple-900 text-purple-300 border-purple-700' : 'bg-purple-100 text-purple-800 border-purple-300',
      librarian: theme === 'dark' ? 'bg-green-900 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-300',
      student: theme === 'dark' ? 'bg-blue-900 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-300',
      default: theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[role] || styles.default}`}>{role?.toUpperCase()}</span>;
  };

  // Sidebar Dropdown
  const SidebarDropdown = ({ title, icon: Icon, items, dropdownKey }) => {
    const isOpen = openDropdowns[dropdownKey];
    return (
      <div className="w-full" ref={el => dropdownRefs.current[dropdownKey] = el}>
        <button
          onClick={(e) => { e.preventDefault(); toggleDropdown(dropdownKey); }}
          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
            theme === 'dark' ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
          } ${isOpen ? (theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900') : ''}`}
        >
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5" />
            <span>{title}</span>
          </div>
          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        {isOpen && (
          <div className="mt-1 ml-8 space-y-1">
            {items.map((item, index) => (
              <button
                key={`${dropdownKey}-${index}`}
                onClick={(e) => { e.preventDefault(); handleDropdownItemClick(item); }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-3 rounded-md transition-colors duration-200 ${
                  location.pathname === item.path 
                    ? (theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800')
                    : (theme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900')
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Sidebar Items - Updated to show all menu items regardless of current route
  const getSidebarItems = () => {
    if (!user) return [
      { type: 'button', label: 'Home', icon: Home, path: '/', onClick: () => navigate('/') },
      { type: 'button', label: 'Books', icon: BookOpen, path: '/viewAllBooks', onClick: () => navigate('/viewAllBooks') }
    ];

    const dashboardPath = user.role === 'admin' ? '/admin-dashboard' : user.role === 'librarian' ? '/librarian-dashboard' : '/student-dashboard';
    const common = [{ type: 'button', label: 'Dashboard', icon: Home, path: dashboardPath, onClick: () => navigate(dashboardPath) }];
    
    if (user.role === 'student') {
      return [
        ...common,
        { type: 'button', label: 'Books', icon: BookOpen, path: '/viewAllBooks', onClick: () => navigate('/viewAllBooks') }
      ];
    }
    
    if (user.role === 'librarian') {
      return [
        ...common,
        { type: 'dropdown', label: 'Transactions', icon: ArrowRightLeft, dropdownKey: 'transactions-sidebar', items: [
          { label: 'All Transactions', path: '/viewAllTransactions', icon: BookUp },
          { label: 'Return Book', path: '/returnBook', icon: BookDown },
          { label: 'Transaction History', path: '/transactionHistory', icon: History },
          { label: 'Active Loans', path: '/activeLoans', icon: Clock },
          { label: 'Overdue Books', path: '/overdueBooks', icon: AlertCircle },
          { label: 'Manage Fines', path: '/manageFines', icon: DollarSign },
          { label: 'Renew Book', path: '/renewBook', icon: Calendar },
          { label: 'Reports', path: '/transactionReports', icon: FileText }
        ]},
        { type: 'dropdown', label: 'Books', icon: BookOpen, dropdownKey: 'books-sidebar', items: [
          { label: 'Add Book', path: '/addBook', icon: Plus },
          { label: 'View Books', path: '/viewAllBooks', icon: Eye }
        ]},
        { type: 'dropdown', label: 'Students', icon: Users, dropdownKey: 'students-sidebar', items: [
          { label: 'Add Student', path: '/addStudents', icon: Plus },
          { label: 'View Students', path: '/viewStudents', icon: Eye }
        ]}
      ];
    }
    
    if (user.role === 'admin') {
      return [
        ...common,
        { type: 'dropdown', label: 'Transactions', icon: ArrowRightLeft, dropdownKey: 'transactions-sidebar', items: [
          { label: 'Issue Book', path: '/issueBook', icon: BookUp },
          { label: 'Return Book', path: '/returnBook', icon: BookDown },
          { label: 'Transaction History', path: '/transactionHistory', icon: History },
          { label: 'Active Loans', path: '/activeLoans', icon: Clock },
          { label: 'Overdue Books', path: '/overdueBooks', icon: AlertCircle },
          { label: 'Manage Fines', path: '/manageFines', icon: DollarSign },
          { label: 'Renew Book', path: '/renewBook', icon: Calendar },
          { label: 'Reports', path: '/transactionReports', icon: FileText }
        ]},
        { type: 'dropdown', label: 'Books', icon: BookOpen, dropdownKey: 'books-sidebar', items: [
          { label: 'Add Book', path: '/addBook', icon: Plus },
          { label: 'View Books', path: '/viewAllBooks', icon: Eye }
        ]},
        { type: 'dropdown', label: 'Category', icon: Tag, dropdownKey: 'category-sidebar', items: [
          { label: 'Add Category', path: '/addCategory', icon: Plus },
          { label: 'View Categories', path: '/viewCategory', icon: Eye }
        ]},
        { type: 'dropdown', label: 'Students', icon: Users, dropdownKey: 'students-sidebar', items: [
          { label: 'Add Student', path: '/addStudents', icon: Plus },
          { label: 'View Students', path: '/viewStudents', icon: Eye }
        ]},
        { type: 'dropdown', label: 'Librarians', icon: Library, dropdownKey: 'librarians-sidebar', items: [
          { label: 'Add Librarian', path: '/addLibrarian', icon: Plus },
          { label: 'View Librarians', path: '/viewLibrarians', icon: Eye }
        ]}
      ];
    }
    
    return [];
  };

  return (
    <>
      {/* Top Navbar - Fixed */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'dark' ? 'bg-gray-900/95 border-gray-700 text-white' : 'bg-white/95 border-gray-200 text-gray-900'
      }`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Menu Button & Logo */}
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={toggleSidebar}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              )}

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
            </div>

            {/* Right Side - Theme Toggle & User Info */}
            <div className="flex items-center space-x-2">
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

              {user ? (
                <div className="flex items-center space-x-2">
                  <RoleBadge role={user.role} />
                  
                  <div className="relative" ref={el => dropdownRefs.current.profile = el}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center space-x-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-100'
                      } ${dropdownOpen ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                    >
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
                      
                      <span className={`text-sm font-medium hidden sm:block ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{user.name || 'User'}</span>
                      
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      } ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                      <div 
                        className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border backdrop-blur-sm ${
                          theme === 'dark'
                            ? 'bg-gray-800/95 border-gray-600 shadow-gray-900/50'
                            : 'bg-white/95 border-gray-200 shadow-gray-900/20'
                        }`}
                        style={{ zIndex: 9999 }}
                      >
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onLoginClick}
                    className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                  <button
                    onClick={onSignUpClick}
                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {sidebarOpen && user && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
          style={{ top: '64px' }}
        />
      )}

      {/* Sidebar */}
      {user && (
        <div className={`
          fixed top-16 left-0 
          h-[calc(100vh-4rem)] 
          w-64 
          transform transition-transform duration-300 ease-in-out 
          z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${theme === 'dark' 
            ? 'bg-gray-900 border-r border-gray-700' 
            : 'bg-white border-r border-gray-200'
          }
        `}>
          <div className="h-full overflow-y-auto p-4">
            <div className="space-y-2">
              {getSidebarItems().map((item, index) => {
                if (item.type === 'button') {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        item.onClick();
                        if (isMobile) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        location.pathname === item.path 
                          ? (theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800')
                          : (theme === 'dark'
                            ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900')
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                } else if (item.type === 'dropdown') {
                  return (
                    <SidebarDropdown
                      key={index}
                      title={item.label}
                      icon={item.icon}
                      items={item.items}
                      dropdownKey={item.dropdownKey}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Global styles to adjust body margin when sidebar is open */}
      <style jsx global>{`
        body {
          margin-left: ${user && sidebarOpen && !isMobile ? '256px' : '0'};
          padding-top: 64px;
          transition: margin-left 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;