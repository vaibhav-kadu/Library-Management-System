import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Bell, Shield, Database, Mail, Globe, Clock, DollarSign, Book, Users, AlertTriangle } from 'lucide-react';

// Settings Component (Class Component)
class SettingsConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'general',
      settings: {
        general: {
          libraryName: 'LibraryHub Central',
          address: '123 Library Street, City, State 12345',
          phone: '+1-555-0123',
          email: 'admin@libraryhub.com',
          website: 'www.libraryhub.com',
          timezone: 'America/New_York',
          language: 'English',
          currency: 'USD'
        },
        borrowing: {
          maxBooksPerUser: 5,
          borrowingPeriodDays: 14,
          maxRenewals: 3,
          renewalPeriodDays: 7,
          overdueGracePeriod: 3,
          finePerDayOverdue: 0.50,
          maxFineAmount: 25.00,
          allowReservations: true,
          reservationExpiryDays: 3
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          dueDateReminders: true,
          overdueNotices: true,
          reservationAlerts: true,
          newBookAlerts: false,
          maintenanceNotices: true,
          reminderDaysBefore: 2
        },
        security: {
          passwordMinLength: 8,
          requireSpecialChars: true,
          requireNumbers: true,
          sessionTimeoutMinutes: 60,
          maxLoginAttempts: 3,
          twoFactorAuth: false,
          ipWhitelisting: false,
          auditLogging: true
        },
        system: {
          backupFrequency: 'daily',
          dataRetentionMonths: 24,
          maintenanceWindow: '02:00-04:00',
          debugMode: false,
          analyticsEnabled: true,
          performanceMonitoring: true,
          autoUpdates: false
        }
      },
      hasUnsavedChanges: false,
      isSaving: false
    };
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleSettingChange = (category, setting, value) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        [category]: {
          ...prevState.settings[category],
          [setting]: value
        }
      },
      hasUnsavedChanges: true
    }));
  };

  handleSaveSettings = () => {
    this.setState({ isSaving: true });
    
    // Simulate API call
    setTimeout(() => {
      this.setState({ 
        isSaving: false, 
        hasUnsavedChanges: false 
      });
      alert('Settings saved successfully!');
    }, 1500);
  };

  handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      this.setState({
        hasUnsavedChanges: true
      });
      alert('Settings reset to defaults. Don\'t forget to save!');
    }
  };

  renderGeneralSettings = () => {
    const { general } = this.state.settings;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Library Name</label>
            <input
              type="text"
              value={general.libraryName}
              onChange={(e) => this.handleSettingChange('general', 'libraryName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              value={general.phone}
              onChange={(e) => this.handleSettingChange('general', 'phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={general.email}
              onChange={(e) => this.handleSettingChange('general', 'email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="text"
              value={general.website}
              onChange={(e) => this.handleSettingChange('general', 'website', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={general.timezone}
              onChange={(e) => this.handleSettingChange('general', 'timezone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={general.currency}
              onChange={(e) => this.handleSettingChange('general', 'currency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Library Address</label>
          <textarea
            value={general.address}
            onChange={(e) => this.handleSettingChange('general', 'address', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
    );
  };

  renderBorrowingSettings = () => {
    const { borrowing } = this.state.settings;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Books Per User</label>
            <input
              type="number"
              min="1"
              max="20"
              value={borrowing.maxBooksPerUser}
              onChange={(e) => this.handleSettingChange('borrowing', 'maxBooksPerUser', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Borrowing Period (Days)</label>
            <input
              type="number"
              min="1"
              max="90"
              value={borrowing.borrowingPeriodDays}
              onChange={(e) => this.handleSettingChange('borrowing', 'borrowingPeriodDays', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Renewals</label>
            <input
              type="number"
              min="0"
              max="10"
              value={borrowing.maxRenewals}
              onChange={(e) => this.handleSettingChange('borrowing', 'maxRenewals', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Period (Days)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={borrowing.renewalPeriodDays}
              onChange={(e) => this.handleSettingChange('borrowing', 'renewalPeriodDays', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overdue Grace Period (Days)</label>
            <input
              type="number"
              min="0"
              max="7"
              value={borrowing.overdueGracePeriod}
              onChange={(e) => this.handleSettingChange('borrowing', 'overdueGracePeriod', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fine Per Day Overdue ($)</label>
            <input
              type="number"
              min="0"
              step="0.25"
              value={borrowing.finePerDayOverdue}
              onChange={(e) => this.handleSettingChange('borrowing', 'finePerDayOverdue', parseFloat(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Allow Reservations</div>
              <div className="text-sm text-gray-500">Let users reserve books that are currently borrowed</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={borrowing.allowReservations}
                onChange={(e) => this.handleSettingChange('borrowing', 'allowReservations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    );
  };

  renderNotificationSettings = () => {
    const { notifications } = this.state.settings;
    
    const notificationOptions = [
      { key: 'emailNotifications', label: 'Email Notifications', description: 'Send notifications via email' },
      { key: 'smsNotifications', label: 'SMS Notifications', description: 'Send notifications via SMS (requires SMS service)' },
      { key: 'dueDateReminders', label: 'Due Date Reminders', description: 'Remind users before books are due' },
      { key: 'overdueNotices', label: 'Overdue Notices', description: 'Send notices when books become overdue' },
      { key: 'reservationAlerts', label: 'Reservation Alerts', description: 'Notify when reserved books become available' },
      { key: 'newBookAlerts', label: 'New Book Alerts', description: 'Notify users about new book arrivals' },
      { key: 'maintenanceNotices', label: 'Maintenance Notices', description: 'Send system maintenance notifications' }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {notificationOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[option.key]}
                  onChange={(e) => this.handleSettingChange('notifications', option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Days Before Due Date</label>
            <input
              type="number"
              min="1"
              max="7"
              value={notifications.reminderDaysBefore}
              onChange={(e) => this.handleSettingChange('notifications', 'reminderDaysBefore', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    );
  };

  renderSecuritySettings = () => {
    const { security } = this.state.settings;
    
    const securityOptions = [
      { key: 'requireSpecialChars', label: 'Require Special Characters', description: 'Passwords must contain special characters' },
      { key: 'requireNumbers', label: 'Require Numbers', description: 'Passwords must contain numbers' },
      { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Enable 2FA for enhanced security' },
      { key: 'ipWhitelisting', label: 'IP Whitelisting', description: 'Restrict access to specific IP addresses' },
      { key: 'auditLogging', label: 'Audit Logging', description: 'Log all user actions for security auditing' }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Minimum Length</label>
            <input
              type="number"
              min="6"
              max="20"
              value={security.passwordMinLength}
              onChange={(e) => this.handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (Minutes)</label>
            <input
              type="number"
              min="15"
              max="480"
              value={security.sessionTimeoutMinutes}
              onChange={(e) => this.handleSettingChange('security', 'sessionTimeoutMinutes', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
            <input
              type="number"
              min="3"
              max="10"
              value={security.maxLoginAttempts}
              onChange={(e) => this.handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {securityOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security[option.key]}
                  onChange={(e) => this.handleSettingChange('security', option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  renderSystemSettings = () => {
    const { system } = this.state.settings;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
            <select
              value={system.backupFrequency}
              onChange={(e) => this.handleSettingChange('system', 'backupFrequency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (Months)</label>
            <input
              type="number"
              min="12"
              max="120"
              value={system.dataRetentionMonths}
              onChange={(e) => this.handleSettingChange('system', 'dataRetentionMonths', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Window</label>
            <input
              type="text"
              placeholder="e.g., 02:00-04:00"
              value={system.maintenanceWindow}
              onChange={(e) => this.handleSettingChange('system', 'maintenanceWindow', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { key: 'debugMode', label: 'Debug Mode', description: 'Enable debug logging (affects performance)' },
            { key: 'analyticsEnabled', label: 'Analytics', description: 'Collect usage analytics for insights' },
            { key: 'performanceMonitoring', label: 'Performance Monitoring', description: 'Monitor system performance metrics' },
            { key: 'autoUpdates', label: 'Automatic Updates', description: 'Automatically install system updates' }
          ].map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={system[option.key]}
                  onChange={(e) => this.handleSettingChange('system', option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { activeTab, hasUnsavedChanges, isSaving } = this.state;
    const { userType } = this.props;

    const tabs = [
      { id: 'general', label: 'General', icon: Globe },
      { id: 'borrowing', label: 'Borrowing', icon: Book },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'security', label: 'Security', icon: Shield },
      { id: 'system', label: 'System', icon: Database }
    ];

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings & Configuration</h1>
              <p className="text-gray-600">Manage library system settings and preferences</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={this.handleResetSettings}
                className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Reset to Defaults</span>
              </button>
              <button
                onClick={this.handleSaveSettings}
                disabled={!hasUnsavedChanges || isSaving}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Save className="h-5 w-5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {hasUnsavedChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">You have unsaved changes. Don't forget to save your settings!</span>
              </div>
            </div>
          )}
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
                    onClick={() => this.handleTabChange(tab.id)}
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

          {/* Content */}
          <div className="p-8">
            {activeTab === 'general' && this.renderGeneralSettings()}
            {activeTab === 'borrowing' && this.renderBorrowingSettings()}
            {activeTab === 'notifications' && this.renderNotificationSettings()}
            {activeTab === 'security' && this.renderSecuritySettings()}
            {activeTab === 'system' && this.renderSystemSettings()}
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsConfiguration;