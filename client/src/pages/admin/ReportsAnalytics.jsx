import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Download, Calendar, Users, BookOpen, Clock, DollarSign, Filter, RefreshCw } from 'lucide-react';

const ReportsAnalytics = ({ userType }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Mock data for charts
  const borrowingTrends = [
    { month: 'Jan', borrowed: 45, returned: 40, overdue: 5 },
    { month: 'Feb', borrowed: 52, returned: 48, overdue: 4 },
    { month: 'Mar', borrowed: 38, returned: 35, overdue: 8 },
    { month: 'Apr', borrowed: 65, returned: 58, overdue: 7 },
    { month: 'May', borrowed: 58, returned: 55, overdue: 3 },
    { month: 'Jun', borrowed: 72, returned: 68, overdue: 4 },
    { month: 'Jul', borrowed: 68, returned: 65, overdue: 6 },
    { month: 'Aug', borrowed: 75, returned: 70, overdue: 5 }
  ];

  const categoryDistribution = [
    { name: 'Fiction', value: 35, color: '#3B82F6' },
    { name: 'Technology', value: 25, color: '#10B981' },
    { name: 'Science', value: 15, color: '#F59E0B' },
    { name: 'History', value: 12, color: '#EF4444' },
    { name: 'Biography', value: 8, color: '#8B5CF6' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ];

  const topBooks = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrows: 23, category: 'Fiction' },
    { title: 'Clean Code', author: 'Robert C. Martin', borrows: 19, category: 'Technology' },
    { title: '1984', author: 'George Orwell', borrows: 17, category: 'Fiction' },
    { title: 'JavaScript Guide', author: 'Douglas Crockford', borrows: 15, category: 'Technology' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', borrows: 14, category: 'Fiction' }
  ];

  const topUsers = [
    { name: 'John Doe', borrows: 12, returns: 10, fines: 5.50 },
    { name: 'Jane Smith', borrows: 10, returns: 9, fines: 2.25 },
    { name: 'Mike Johnson', borrows: 8, returns: 8, fines: 0.00 },
    { name: 'Sarah Wilson', borrows: 7, returns: 6, fines: 12.75 },
    { name: 'David Brown', borrows: 6, returns: 6, fines: 0.00 }
  ];

  const monthlyRevenue = [
    { month: 'Jan', fines: 125.50, newBooks: 450.00 },
    { month: 'Feb', fines: 89.25, newBooks: 320.00 },
    { month: 'Mar', fines: 156.75, newBooks: 680.00 },
    { month: 'Apr', fines: 98.50, newBooks: 290.00 },
    { month: 'May', fines: 67.25, newBooks: 540.00 },
    { month: 'Jun', fines: 134.80, newBooks: 380.00 },
    { month: 'Jul', fines: 178.90, newBooks: 720.00 },
    { month: 'Aug', fines: 203.15, newBooks: 425.00 }
  ];

  const keyMetrics = {
    totalBooks: 1247,
    activeUsers: 156,
    booksCirculated: 523,
    averageBorrowDays: 12.5,
    overdueRate: 8.3,
    totalFinesCollected: 1234.56,
    newMemberships: 23,
    bookUtilizationRate: 67.8
  };

  const generateReport = () => {
    // Mock report generation
    alert(`Generating ${selectedReport} report for ${selectedPeriod} period...`);
  };

  const exportData = (format) => {
    // Mock export functionality
    alert(`Exporting data in ${format} format...`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into library operations</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={generateReport}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Generate Report</span>
            </button>
            <div className="relative">
              <select
                onChange={(e) => exportData(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-indigo-500"
                defaultValue=""
              >
                <option value="" disabled>Export Data</option>
                <option value="pdf">Export as PDF</option>
                <option value="excel">Export as Excel</option>
                <option value="csv">Export as CSV</option>
              </select>
              <Download className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="overview">Overview</option>
                <option value="borrowing">Borrowing Analysis</option>
                <option value="inventory">Inventory Report</option>
                <option value="financial">Financial Report</option>
                <option value="user-activity">User Activity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Books', value: keyMetrics.totalBooks.toLocaleString(), icon: BookOpen, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
          { title: 'Active Users', value: keyMetrics.activeUsers, icon: Users, color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100' },
          { title: 'Books Circulated', value: keyMetrics.booksCirculated, icon: TrendingUp, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' },
          { title: 'Total Fines', value: `$${keyMetrics.totalFinesCollected.toFixed(2)}`, icon: DollarSign, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-100' }
        ].map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${metric.bgColor} p-6 rounded-2xl border border-white/50`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${metric.color} p-3 rounded-xl`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Borrowing Trends */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Borrowing Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={borrowingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="borrowed" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="returned" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="overdue" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Borrowed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Returned</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Overdue</span>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Book Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Trends */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
            <Bar dataKey="fines" fill="#EF4444" name="Fines Collected" />
            <Bar dataKey="newBooks" fill="#3B82F6" name="New Book Purchases" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Fines Collected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">New Book Purchases</span>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Books */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Most Borrowed Books</h3>
          <div className="space-y-4">
            {topBooks.map((book, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-500">by {book.author}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{book.borrows}</div>
                  <div className="text-xs text-gray-500">borrows</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Most Active Users</h3>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.borrows} borrows, {user.returns} returns</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${user.fines > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${user.fines.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">fines</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{keyMetrics.overdueRate}%</div>
            <div className="text-sm text-gray-600">Overdue Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{keyMetrics.newMemberships}</div>
            <div className="text-sm text-gray-600">New Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{keyMetrics.bookUtilizationRate}%</div>
            <div className="text-sm text-gray-600">Book Utilization</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-gray-700">Peak Borrowing Day:</strong>
              <div className="text-gray-600">Fridays (avg. 23 books)</div>
            </div>
            <div>
              <strong className="text-gray-700">Most Popular Category:</strong>
              <div className="text-gray-600">Fiction (35% of borrows)</div>
            </div>
            <div>
              <strong className="text-gray-700">Collection Growth:</strong>
              <div className="text-gray-600">+47 books this month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;