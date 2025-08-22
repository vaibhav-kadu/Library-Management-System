import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Database, 
  UserPlus, 
  Bell, 
  LogOut,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Lock,
  Trash2
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(7);

  // Sample data - replace with actual API calls
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1567,
    totalBooks: 12450,
    activeLibrarians: 8,
    systemUptime: "99.9%",
    dailyTransactions: 234,
    storageUsed: "78%"
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
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
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
                <Shield className="h-8 w-8 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
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
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'Admin'}
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
            System Overview
          </h2>
          <p className="text-gray-600">Monitor and manage your library system</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              <UserPlus className="h-4 w-4" />
              <span>Add Librarian</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Database className="h-4 w-4" />
              <span>Backup System</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span>Generate Reports</span>
            </button>
            <button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
              <span>System Settings</span>
            </button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalBooks.toLocaleString()}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Librarians</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeLibrarians}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.systemUptime}</p>
              </div>
              <Server className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.dailyTransactions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.storageUsed}</p>
              </div>
              <Database className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* System Alerts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
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
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No system alerts</p>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                Recent Users
              </h3>
            </div>
            <div className="p-6">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.role}</p>
                        <p className="text-xs text-gray-500 mt-1">Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(user.status)}`}>
                          {user.status}
                        </span>
                        <button className="text-purple-600 hover:text-purple-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent users</p>
              )}
            </div>
          </div>
        </div>

        {/* Library Branch Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
              Library Branch Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {libraryStats.map((branch, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{branch.branch}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(branch.status)}`}>
                      {branch.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Books:</span>
                      <span className="text-sm font-medium text-gray-900">{branch.books.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Members:</span>
                      <span className="text-sm font-medium text-gray-900">{branch.members.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Tools */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">User Management</span>
            </button>
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <Shield className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Role Permissions</span>
            </button>
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <Database className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Database Admin</span>
            </button>
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <BarChart3 className="h-6 w-6 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </button>
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <Settings className="h-6 w-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">System Config</span>
            </button>
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <Activity className="h-6 w-6 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Audit Logs</span>
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Maintenance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Security Status</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Last security scan: 2 hours ago</p>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Secure</span>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Last Backup</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Completed: 6 hours ago</p>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Up to date</span>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Server className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Server Health</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">CPU: 45% | RAM: 62%</p>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Healthy</span>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">Maintenance</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Next scheduled: Tonight 2 AM</p>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">Scheduled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;