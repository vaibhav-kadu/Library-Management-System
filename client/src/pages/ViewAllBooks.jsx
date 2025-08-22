import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Calendar, 
  User, 
  Eye, 
  Heart,
  ArrowLeft,
  ChevronDown,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

const ViewAllBooks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [showFilters, setShowFilters] = useState(false);

  // Sample books data - replace with actual API call
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      isbn: "978-0596517748",
      category: "Programming",
      publisher: "O'Reilly Media",
      publishedYear: 2008,
      pages: 176,
      description: "Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad...",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      status: "available",
      totalCopies: 5,
      availableCopies: 3,
      rating: 4.5,
      dateAdded: "2025-01-15",
      tags: ["Web Development", "JavaScript", "Programming"]
    },
    {
      id: 2,
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Programming",
      publisher: "Prentice Hall",
      publishedYear: 2008,
      pages: 464,
      description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees...",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      status: "available",
      totalCopies: 3,
      availableCopies: 1,
      rating: 4.8,
      dateAdded: "2025-01-10",
      tags: ["Clean Code", "Software Engineering", "Best Practices"]
    },
    {
      id: 3,
      title: "The Design of Everyday Things",
      author: "Don Norman",
      isbn: "978-0465050659",
      category: "Design",
      publisher: "Basic Books",
      publishedYear: 2013,
      pages: 368,
      description: "The ultimate guide to human-centered design. Design doesn't have to complicated, which is why this guide to...",
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      status: "checked_out",
      totalCopies: 2,
      availableCopies: 0,
      rating: 4.6,
      dateAdded: "2025-01-05",
      tags: ["UX Design", "Psychology", "Product Design"]
    },
    {
      id: 4,
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      isbn: "978-0062316097",
      category: "History",
      publisher: "Harper",
      publishedYear: 2015,
      pages: 443,
      description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution...",
      coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
      status: "available",
      totalCopies: 4,
      availableCopies: 4,
      rating: 4.7,
      dateAdded: "2024-12-20",
      tags: ["Anthropology", "Evolution", "Civilization"]
    },
    {
      id: 5,
      title: "The Pragmatic Programmer",
      author: "David Thomas, Andrew Hunt",
      isbn: "978-0201616224",
      category: "Programming",
      publisher: "Addison-Wesley Professional",
      publishedYear: 2019,
      pages: 352,
      description: "The Pragmatic Programmer is one of those rare tech books you'll read, re-read, and read again...",
      coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=600&fit=crop",
      status: "maintenance",
      totalCopies: 3,
      availableCopies: 0,
      rating: 4.9,
      dateAdded: "2024-12-15",
      tags: ["Programming", "Software Development", "Career"]
    },
    {
      id: 6,
      title: "Atomic Habits",
      author: "James Clear",
      isbn: "978-0735211292",
      category: "Self-Help",
      publisher: "Avery",
      publishedYear: 2018,
      pages: 320,
      description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day...",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      status: "available",
      totalCopies: 6,
      availableCopies: 5,
      rating: 4.8,
      dateAdded: "2024-12-01",
      tags: ["Habits", "Self-Improvement", "Psychology"]
    }
  ]);

  const categories = ['all', 'Programming', 'Design', 'History', 'Self-Help', 'Science', 'Fiction'];
  const statusOptions = ['all', 'available', 'checked_out', 'maintenance'];
  const sortOptions = ['title', 'author', 'publishedYear', 'rating', 'dateAdded'];

  // Filter and sort books
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'author': return a.author.localeCompare(b.author);
        case 'publishedYear': return b.publishedYear - a.publishedYear;
        case 'rating': return b.rating - a.rating;
        case 'dateAdded': return new Date(b.dateAdded) - new Date(a.dateAdded);
        default: return 0;
      }
    });

  const getStatusBadge = (status, availableCopies, totalCopies) => {
    switch (status) {
      case 'available':
        return availableCopies > 0 
          ? <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Available ({availableCopies})</span>
          : <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center"><Clock className="w-3 h-3 mr-1" />All Checked Out</span>;
      case 'checked_out':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center"><User className="w-3 h-3 mr-1" />Checked Out</span>;
      case 'maintenance':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center"><XCircle className="w-3 h-3 mr-1" />Maintenance</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Unknown</span>;
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  const BookCard = ({ book }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop';
          }}
        />
        <div className="absolute top-2 right-2">
          {user?.role === 'student' && (
            <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
            {book.title}
          </h3>
          {getStatusBadge(book.status, book.availableCopies, book.totalCopies)}
        </div>
        
        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
        
        <div className="flex items-center mb-2">
          {renderStars(book.rating)}
        </div>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{book.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {book.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
              {tag}
            </span>
          ))}
          {book.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">
              +{book.tags.length - 2}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{book.publishedYear}</span>
          <span>{book.pages} pages</span>
        </div>
        
        <div className="flex space-x-2">
          {user?.role === 'student' && book.status === 'available' && book.availableCopies > 0 && (
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-md transition-colors">
              Borrow Book
            </button>
          )}
          
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2 px-3 rounded-md transition-colors flex items-center justify-center">
            <Eye className="w-3 h-3 mr-1" />View Details
          </button>
          
          {(user?.role === 'librarian' || user?.role === 'admin') && (
            <>
              <button className="bg-green-100 hover:bg-green-200 text-green-700 text-xs py-2 px-2 rounded-md transition-colors">
                <Edit className="w-3 h-3" />
              </button>
              {user?.role === 'admin' && (
                <button className="bg-red-100 hover:bg-red-200 text-red-700 text-xs py-2 px-2 rounded-md transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const BookListItem = ({ book }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex space-x-4">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-16 h-24 object-cover rounded flex-shrink-0"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop';
          }}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 mr-4">
              <h3 className="font-semibold text-gray-900 text-lg">{book.title}</h3>
              <p className="text-gray-600 mb-1">by {book.author}</p>
              <div className="flex items-center mb-2">
                {renderStars(book.rating)}
              </div>
            </div>
            {getStatusBadge(book.status, book.availableCopies, book.totalCopies)}
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{book.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{book.publishedYear}</span>
            <span>{book.pages} pages</span>
            <span>ISBN: {book.isbn}</span>
            <span>{book.publisher}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {book.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            {user?.role === 'student' && book.status === 'available' && book.availableCopies > 0 && (
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md transition-colors">
                Borrow Book
              </button>
            )}
            
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-4 rounded-md transition-colors flex items-center">
              <Eye className="w-4 h-4 mr-1" />View Details
            </button>
            
            {user?.role === 'student' && (
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-md transition-colors">
                <Heart className="w-4 h-4 text-red-500" />
              </button>
            )}
            
            {(user?.role === 'librarian' || user?.role === 'admin') && (
              <>
                <button className="bg-green-100 hover:bg-green-200 text-green-700 text-sm py-2 px-3 rounded-md transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                {user?.role === 'admin' && (
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 text-sm py-2 px-3 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">All Books</h1>
              </div>
            </div>
            
            {(user?.role === 'librarian' || user?.role === 'admin') && (
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add New Book</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors, or tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Status' : 
                         status === 'checked_out' ? 'Checked Out' :
                         status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option} value={option}>
                        {option === 'publishedYear' ? 'Publication Year' :
                         option === 'dateAdded' ? 'Date Added' :
                         option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                      setSortBy('title');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredBooks.length} of {books.length} books
            </p>
            <div className="text-sm text-gray-500">
              {searchQuery && `Results for "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </div>
          </div>
        </div>
        
        {/* Books Display */}
        {filteredBooks.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBooks.map(book => (
                <BookListItem key={book.id} book={book} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? `No books match your search "${searchQuery}"` : 'No books match your current filters'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllBooks;