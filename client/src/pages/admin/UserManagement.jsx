import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Search, Mail, Phone, Calendar, UserCheck, UserX, Filter } from 'lucide-react';

// User Management Component (Functional Component)
const UserManagement = ({ userType, onNavigate }) => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@email.com', 
      phone: '+1-234-567-8901',
      userType: 'student', 
      status: 'active', 
      joinDate: '2024-01-15',
      borrowedBooks: 2,
      fineAmount: 0
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane.smith@email.com', 
      phone: '+1-234-567-8902',
      userType: 'student', 
      status: 'active', 
      joinDate: '2024-02-20',
      borrowedBooks: 1,
      fineAmount: 5.50
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike.johnson@email.com', 
      phone: '+1-234-567-8903',
      userType: 'librarian', 
      status: 'active', 
      joinDate: '2023-08-10',
      borrowedBooks: 0,
      fineAmount: 0
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah.wilson@email.com', 
      phone: '+1-234-567-8904',
      userType: 'student', 
      status: 'inactive', 
      joinDate: '2024-03-05',
      borrowedBooks: 0,
      fineAmount: 12.25
    },
    { 
      id: 5, 
      name: 'David Brown', 
      email: 'david.brown@email.com', 
      phone: '+1-234-567-8905',
      userType: 'admin', 
      status: 'active', 
      joinDate: '2023-01-01',
      borrowedBooks: 0,
      fineAmount: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterUserType, setFilterUserType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUserType = !filterUserType || user.userType === filterUserType;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    
    return matchesSearch && matchesUserType && matchesStatus;
  });

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const getUserTypeColor = (type) => {
    const colors = {
      'student': 'bg-blue-100 text-blue-800',
      'librarian': 'bg-green-100 text-green-800',
      'admin': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
            <p className="text-gray-600">Manage library users and their permissions</p>
          </div>
          {userType === 'admin' && (
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Add New User</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by User Type</label>
              <select
                value={filterUserType}
                onChange={(e) => setFilterUserType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">All User Types</option>
                <option value="student">Students</option>
                <option value="librarian">Librarians</option>
                <option value="admin">Admins</option>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { 
              title: 'Total Users', 
              value: users.length, 
              icon: Users, 
              color: 'from-blue-500 to-blue-600',
              bgColor: 'from-blue-50 to-blue-100'
            },
            { 
              title: 'Active Users', 
              value: users.filter(u => u.status === 'active').length, 
              icon: UserCheck, 
              color: 'from-green-500 to-green-600',
              bgColor: 'from-green-50 to-green-100'
            },
            { 
              title: 'Students', 
              value: users.filter(u => u.userType === 'student').length, 
              icon: Users, 
              color: 'from-purple-500 to-purple-600',
              bgColor: 'from-purple-50 to-purple-100'
            },
            { 
              title: 'Pending Fines', 
              value: `$${users.reduce((sum, u) => sum + u.fineAmount, 0).toFixed(2)}`, 
              icon: Calendar, 
              color: 'from-orange-500 to-orange-600',
              bgColor: 'from-orange-50 to-orange-100'
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className={`bg-gradient-to-br ${stat.bgColor} p-6 rounded-2xl border border-white/50`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Users</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Books</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Fines</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-1" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getUserTypeColor(user.userType)}`}>
                      {user.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.borrowedBooks} borrowed
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={user.fineAmount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      ${user.fineAmount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-all"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-1 rounded transition-all ${
                          user.status === 'active'
                            ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        }`}
                        title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      {userType === 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;