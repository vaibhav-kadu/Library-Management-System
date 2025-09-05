import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import AddStudent from './pages/students/AddStudent';
import Login from './pages/Login';
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import ProfileAccountManagement from './pages/admin/ProfileAccountManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import ViewAllBooks from './pages/books/ViewAllBooks';
import StudentDashboard from './pages/students/StudentDashboard';
import AddLibrarian from './pages/librarian/AddLibrarian';
import AddBook from './pages/books/AddBook';
import StudentProfile from './pages/students/StudentProfile ';
import AddCategory from './pages/category/AddCategory';
import ViewCategories from './pages/category/ViewCategories';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BackgroundWrapper from './components/BackgroundWrapper';
import SignUp from './pages/SignUp';

function AppContent() {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  // Handle dropdown item clicks
  const handleDropdownItemClick = (item) => {
    console.log('Dropdown item clicked:', item);
    
    // Add custom logic based on item label or path
    if (item.label.includes('Delete')) {
      const confirmMessage = `Are you sure you want to delete this ${item.label.split(' ')[1].toLowerCase()}?`;
      if (!window.confirm(confirmMessage)) {
        return; // Don't navigate if cancelled
      }
    }
    
    if (item.label === 'Add Book') {
      console.log('Preparing to add a new book...');
      // You can add any pre-navigation logic here
    }
    
    if (item.label === 'View Books') {
      console.log('Loading all books...');
      // Maybe show a loading state
    }
    
    // Navigate to the path
    navigate(item.path);
  };

  return (
    <BackgroundWrapper theme={theme}>
      <Navbar 
        theme={theme} 
        setTheme={setTheme} 
        onLoginClick={() => setShowLoginModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
        onDropdownItemClick={handleDropdownItemClick}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <Login 
          onClose={() => setShowLoginModal(false)} 
          theme={theme}
        />
      )}

      {showSignUpModal && (
        <SignUp 
          onClose={() => setShowSignUpModal(false)} 
          theme={theme}
        />
      )}

      <Routes>
        <Route path="/" element={<LandingPage theme={theme} />} />
        <Route path='/login' element={<LandingPage theme={theme}/>}/>
        <Route path="/home" element={<Home theme={theme} />} />
        <Route path="/addStudent" element={<AddStudent theme={theme} />} />
        <Route path="/student-profile" element={<StudentProfile theme={theme} />} />
        <Route path = "/signup" element = {<SignUp theme={theme}/>}/>
        
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin']}>
                <AdminDashboard theme={theme} />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        <Route
          path="/librarian-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['librarian']}>
                <LibrarianDashboard theme={theme} />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        <Route path="/student-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['student']}>
              <StudentDashboard theme={theme} />
            </RoleBaseRoutes>
          </PrivateRoutes>
        } />

        <Route path="/addLibrarian" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin']}>
              <AddLibrarian theme={theme} />
            </RoleBaseRoutes>
          </PrivateRoutes>
        } />

        <Route path="/addStudents" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin', 'librarian']}>
              <AddStudent theme={theme} />
            </RoleBaseRoutes>
          </PrivateRoutes>
        } />

        <Route path="/viewAllBooks" element={<ViewAllBooks theme={theme} />} />
        <Route path="/profileAccountManagement" element={<ProfileAccountManagement theme={theme} />} />
        <Route path="/addCategory" element={<AddCategory theme={theme} />} />
        <Route path="/viewCategory" element={<ViewCategories theme={theme} />} />
        <Route path="/addBook" element={<AddBook theme={theme} />} />
        
        {/* Additional CRUD operation routes */}
        <Route path="/updateBook" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Update Book Page - Coming Soon</div>} />
        <Route path="/deleteBook" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete Book Page - Coming Soon</div>} />
        <Route path="/viewStudents" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>View Students Page - Coming Soon</div>} />
        <Route path="/updateStudent" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Update Student Page - Coming Soon</div>} />
        <Route path="/deleteStudent" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete Student Page - Coming Soon</div>} />
        <Route path="/updateCategory" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Update Category Page - Coming Soon</div>} />
        <Route path="/deleteCategory" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete Category Page - Coming Soon</div>} />
        <Route path="/viewLibrarians" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>View Librarians Page - Coming Soon</div>} />
        <Route path="/updateLibrarian" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Update Librarian Page - Coming Soon</div>} />
        <Route path="/deleteLibrarian" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete Librarian Page - Coming Soon</div>} />
        <Route path="/settings" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Settings Page - Coming Soon</div>} />
      </Routes>
    </BackgroundWrapper>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;