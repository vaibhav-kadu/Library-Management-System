import React, { useState } from 'react';
import { BookOpen, Calendar, User, Clock, CheckCircle, AlertCircle, XCircle, Search, Filter, Download, ArrowUpDown } from 'lucide-react';

// Borrowing Management Component (Class Component)
class BorrowingManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [
        {
          id: 'TXN001',
          bookId: 1,
          bookTitle: 'The Great Gatsby',
          bookAuthor: 'F. Scott Fitzgerald',
          userId: 1,
          userName: 'John Doe',
          borrowDate: '2024-08-01',
          dueDate: '2024-08-15',
          returnDate: null,
          status: 'borrowed',
          fine: 0,
          renewals: 1
        },
        {
          id: 'TXN002',
          bookId: 2,
          bookTitle: 'To Kill a Mockingbird',
          bookAuthor: 'Harper Lee',
          userId: 2,
          userName: 'Jane Smith',
          borrowDate: '2024-07-20',
          dueDate: '2024-08-03',
          returnDate: '2024-08-05',
          status: 'returned',
          fine: 2.50,
          renewals: 0
        },
        {
          id: 'TXN003',
          bookId: 3,
          bookTitle: 'JavaScript: The Good Parts',
          bookAuthor: 'Douglas Crockford',
          userId: 1,
          userName: 'John Doe',
          borrowDate: '2024-07-15',
          dueDate: '2024-07-29',
          returnDate: null,
          status: 'overdue',
          fine: 15.75,
          renewals: 2
        },
        {
          id: 'TXN004',
          bookId: 4,
          bookTitle: 'Clean Code',
          bookAuthor: 'Robert C. Martin',
          userId: 4,
          userName: 'Sarah Wilson',
          borrowDate: '2024-08-10',
          dueDate: '2024-08-24',
          returnDate: '2024-08-20',
          status: 'returned',
          fine: 0,
          renewals: 0
        },
        {
          id: 'TXN005',
          bookId: 5,
          bookTitle: '1984',
          bookAuthor: 'George Orwell',
          userId: 3,
          userName: 'Mike Johnson',
          borrowDate: '2024-08-12',
          dueDate: '2024-08-26',
          returnDate: null,
          status: 'borrowed',
          fine: 0,
          renewals: 0
        }
      ],
      searchTerm: '',
      filterStatus: '',
      sortBy: 'borrowDate',
      sortOrder: 'desc',
      selectedTransaction: null,
      showReturnModal: false
    };
  }

  handleSearch = (value) => {
    this.setState({ searchTerm: value });
  };

  handleFilterStatus = (status) => {
    this.setState({ filterStatus: status });
  };

  handleSort = (field) => {
    const { sortBy, sortOrder } = this.state;
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    this.setState({ sortBy: field, sortOrder: newOrder });
  };

  handleReturnBook = (transaction) => {
    this.setState({ 
      selectedTransaction: transaction,
      showReturnModal: true 
    });
  };

  confirmReturn = () => {
    const { selectedTransaction, transactions } = this.state;
    const updatedTransactions = transactions.map(txn =>
      txn.id === selectedTransaction.id
        ? { 
            ...txn, 
            status: 'returned', 
            returnDate: new Date().toISOString().split('T')[0] 
          }
        : txn
    );
    
    this.setState({
      transactions: updatedTransactions,
      selectedTransaction: null,
      showReturnModal: false
    });
  };

  handleRenewBook = (transactionId) => {
    const { transactions } = this.state;
    const updatedTransactions = transactions.map(txn =>
      txn.id === transactionId
        ? { 
            ...txn, 
            renewals: txn.renewals + 1,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        : txn
    );
    
    this.setState({ transactions: updatedTransactions });
  };

  getStatusColor = (status) => {
    const colors = {
      'borrowed': 'bg-blue-100 text-blue-800',
      'returned': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  getStatusIcon = (status) => {
    const icons = {
      'borrowed': Clock,
      'returned': CheckCircle,
      'overdue': AlertCircle
    };
    return icons[status] || Clock;
  };

  getFilteredAndSortedTransactions = () => {
    const { transactions, searchTerm, filterStatus, sortBy, sortOrder } = this.state;
    
    let filtered = transactions.filter(txn => {
      const matchesSearch = txn.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           txn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           txn.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || txn.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy.includes('Date')) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  calculateDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  render() {
    const { searchTerm, filterStatus, sortBy, sortOrder, showReturnModal, selectedTransaction } = this.state;
    const transactions = this.getFilteredAndSortedTransactions();
    const { userType } = this.props;

    // Statistics
    const stats = {
      totalTransactions: this.state.transactions.length,
      activeBorrows: this.state.transactions.filter(t => t.status === 'borrowed').length,
      overdueBooks: this.state.transactions.filter(t => t.status === 'overdue').length,
      totalFines: this.state.transactions.reduce((sum, t) => sum + t.fine, 0)
    };

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Borrowing Management</h1>
              <p className="text-gray-600">Track book transactions and manage returns</p>
            </div>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105">
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { 
                title: 'Total Transactions', 
                value: stats.totalTransactions, 
                icon: BookOpen, 
                color: 'from-blue-500 to-blue-600',
                bgColor: 'from-blue-50 to-blue-100'
              },
              { 
                title: 'Active Borrows', 
                value: stats.activeBorrows, 
                icon: Clock, 
                color: 'from-orange-500 to-orange-600',
                bgColor: 'from-orange-50 to-orange-100'
              },
              { 
                title: 'Overdue Books', 
                value: stats.overdueBooks, 
                icon: AlertCircle, 
                color: 'from-red-500 to-red-600',
                bgColor: 'from-red-50 to-red-100'
              },
              { 
                title: 'Total Fines', 
                value: `$${stats.totalFines.toFixed(2)}`, 
                icon: XCircle, 
                color: 'from-purple-500 to-purple-600',
                bgColor: 'from-purple-50 to-purple-100'
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

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Transactions</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by book, user, or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => this.handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => this.handleFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">All Status</option>
                  <option value="borrowed">Borrowed</option>
                  <option value="returned">Returned</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    this.setState({ sortBy: field, sortOrder: order });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="borrowDate-desc">Borrow Date (Newest)</option>
                  <option value="borrowDate-asc">Borrow Date (Oldest)</option>
                  <option value="dueDate-asc">Due Date (Earliest)</option>
                  <option value="dueDate-desc">Due Date (Latest)</option>
                  <option value="userName-asc">User Name (A-Z)</option>
                  <option value="bookTitle-asc">Book Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Book Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Fine
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => {
                  const StatusIcon = this.getStatusIcon(transaction.status);
                  const isOverdue = transaction.status === 'overdue';
                  const daysOverdue = isOverdue ? this.calculateDaysOverdue(transaction.dueDate) : 0;

                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                        <div className="text-xs text-gray-500">
                          {transaction.renewals > 0 && `${transaction.renewals} renewal${transaction.renewals > 1 ? 's' : ''}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.bookTitle}</div>
                        <div className="text-sm text-gray-500">by {transaction.bookAuthor}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-xs">
                              {transaction.userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{transaction.userName}</div>
                            <div className="text-sm text-gray-500">ID: {transaction.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            Borrowed: {new Date(transaction.borrowDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center mb-1">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            Due: {new Date(transaction.dueDate).toLocaleDateString()}
                          </div>
                          {transaction.returnDate && (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                              Returned: {new Date(transaction.returnDate).toLocaleDateString()}
                            </div>
                          )}
                          {isOverdue && (
                            <div className="text-xs text-red-600 font-medium mt-1">
                              {daysOverdue} days overdue
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${this.getStatusColor(transaction.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          transaction.fine > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          ${transaction.fine.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {transaction.status === 'borrowed' && (
                            <button
                              onClick={() => this.handleReturnBook(transaction)}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-200 transition-all"
                            >
                              Return
                            </button>
                          )}
                          {(transaction.status === 'borrowed' && transaction.renewals < 3) && (
                            <button
                              onClick={() => this.handleRenewBook(transaction.id)}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-200 transition-all"
                            >
                              Renew
                            </button>
                          )}
                          {transaction.status === 'overdue' && (
                            <button
                              onClick={() => this.handleReturnBook(transaction)}
                              className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition-all"
                            >
                              Force Return
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Return Book Modal */}
        {showReturnModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Book Return</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-600 mb-2">Transaction: <span className="font-medium text-gray-900">{selectedTransaction.id}</span></div>
                <div className="text-sm text-gray-600 mb-2">Book: <span className="font-medium text-gray-900">{selectedTransaction.bookTitle}</span></div>
                <div className="text-sm text-gray-600 mb-2">Borrower: <span className="font-medium text-gray-900">{selectedTransaction.userName}</span></div>
                <div className="text-sm text-gray-600">Due Date: <span className="font-medium text-gray-900">{new Date(selectedTransaction.dueDate).toLocaleDateString()}</span></div>
                
                {selectedTransaction.status === 'overdue' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-sm text-red-800">
                      <strong>Overdue Fine:</strong> ${selectedTransaction.fine.toFixed(2)}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      {this.calculateDaysOverdue(selectedTransaction.dueDate)} days overdue
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => this.setState({ showReturnModal: false, selectedTransaction: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={this.confirmReturn}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BorrowingManagement;