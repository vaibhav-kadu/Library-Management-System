import React, { useState } from 'react';
import { User, Edit, Save, Camera, Lock, Bell, History, CreditCard, Eye, EyeOff, CheckCircle, AlertCircle, Calendar, Book, DollarSign } from 'lucide-react';

const ProfileAccountManagement = ({ userType }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    id: 'USR001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-234-567-8901',
    address: '123 Main Street, City, State 12345',
    dateOfBirth: '1990-05-15',
    memberSince: '2023-01-15',
    status: 'active',
    userType: userType || 'student',
    profileImage: null
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    dueDateReminders: true,
    newBookAlerts: true,
    language: 'English',
    timezone: 'America/New_York'
  });

  // Mock data for user activity
  const borrowingHistory = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowDate: '2024-07-15', returnDate: '2024-07-29', status: 'returned' },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', borrowDate: '2024-08-01', returnDate: null, status: 'borrowed' },
    { id: 3, title: '1984', author: 'George Orwell', borrowDate: '2024-06-20', returnDate: '2024-07-05', status: 'returned' },
    { id: 4, title: 'JavaScript Guide', author: 'Douglas Crockford', borrowDate: '2024-08-10', returnDate: null, status: 'overdue' }
  ];

  const fineHistory = [
    { id: 1, book: 'JavaScript Guide', amount: 5.50, reason: 'Overdue (11 days)', date: '2024-08-21', status: 'pending' },
    { id: 2, book: 'Python Cookbook', amount: 2.25, reason: 'Overdue (3 days)', date: '2024-07-15', status: 'paid' },
    { id: 3, book: 'Data Structures', amount: 7.75, reason: 'Overdue (15 days)', date: '2024-06-10', status: 'paid' }
  ];

  const handleProfileUpdate = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceUpdate = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    alert('Password changed successfully!');
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserStats = () => {
    const totalBorrowed = borrowingHistory.length;
    const currentlyBorrowed = borrowingHistory.filter(b => b.status === 'borrowed' || b.status === 'overdue').length;
    const totalFines = fineHistory.reduce((sum, fine) => sum + fine.amount, 0);
    const pendingFines = fineHistory.filter(f => f.status === 'pending').reduce((sum, fine) => sum + fine.amount, 0);

    return { totalBorrowed, currentlyBorrowed, totalFines, pendingFines };
  };

  const stats = getUserStats();

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-2xl">
                {profile.firstName[0]}{profile.lastName[0]}
              </span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Camera className="h-4 w-4 text-gray-600" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</h2>
          <p className="text-gray-600 capitalize">{profile.userType}</p>
          <p className="text-sm text-gray-500">Member since {new Date(profile.memberSince).toLocaleDateString()}</p>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
            profile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {profile.status === 'active' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <Edit className="h-4 w-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Form */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileUpdate('email', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => handleProfileUpdate('phone', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={profile.dateOfBirth}
              onChange={(e) => handleProfileUpdate('dateOfBirth', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member ID</label>
            <input
              type="text"
              value={profile.id}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={profile.address}
              onChange={(e) => handleProfileUpdate('address', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Security</h3>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Lock className="h-4 w-4" />
            <span>Change Password</span>
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-8">
      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Borrowed', value: stats.totalBorrowed, icon: Book, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
          { title: 'Currently Borrowed', value: stats.currentlyBorrowed, icon: Calendar, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-100' },
          { title: 'Total Fines', value: `$${stats.totalFines.toFixed(2)}`, icon: DollarSign, color: 'from-red-500 to-red-600', bgColor: 'from-red-50 to-red-100' },
          { title: 'Pending Fines', value: `$${stats.pendingFines.toFixed(2)}`, icon: AlertCircle, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.bgColor} p-6 rounded-2xl border border-white/50`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Borrowing History */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Borrowing History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowingHistory.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{record.title}</div>
                      <div className="text-sm text-gray-500">by {record.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(record.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.returnDate ? new Date(record.returnDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'returned' ? 'bg-green-100 text-green-800' :
                      record.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fine History */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Fine History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fineHistory.map((fine) => (
                <tr key={fine.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{fine.book}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">${fine.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{fine.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(fine.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      fine.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
            { key: 'dueDateReminders', label: 'Due Date Reminders', description: 'Get reminded before books are due' },
            { key: 'newBookAlerts', label: 'New Book Alerts', description: 'Be notified about new book arrivals' }
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{pref.label}</div>
                <div className="text-sm text-gray-500">{pref.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[pref.key]}
                  onChange={(e) => handlePreferenceUpdate(pref.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">General Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceUpdate('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => handlePreferenceUpdate('timezone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activity', label: 'Activity', icon: History },
    { id: 'preferences', label: 'Preferences', icon: Bell }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Account</h1>
        <p className="text-gray-600">Manage your profile, view activity, and update preferences</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'activity' && renderActivityTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfileAccountManagement;