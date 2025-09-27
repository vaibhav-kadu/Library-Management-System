import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import AddStudent from './pages/students/AddStudent';
import Login from './pages/Login';
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import ViewAllBooks from './pages/books/ViewAllBooks';
import StudentDashboard from './pages/students/StudentDashboard';
import AddLibrarian from './pages/librarian/AddLibrarian';
import AddBook from './pages/books/AddBook';
import AddCategory from './pages/category/AddCategory';
import ViewCategories from './pages/category/ViewCategories';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landingpage';
import BackgroundWrapper from './components/BackgroundWrapper';
import SignUp from './pages/SignUp';
import ViewLibrarian from './pages/librarian/ViewLibrarian';
import ViewStudent from './pages/students/ViewStudent';   
import StudentProfile from './pages/students/StudentProfile';
import ViewAllTransactions from './pages/transactions/ViewAllTransactions';
import ContactUsPage from './pages/others/ContactUsPage';

function AppContent() {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  return (
    <BackgroundWrapper theme={theme}>
      <Navbar
        theme={theme}
        setTheme={setTheme}
        onLoginClick={() => setShowLoginModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
        onDropdownItemClick={(item) => navigate(item.path)}
      />

      {showLoginModal && (
        <Login onClose={() => setShowLoginModal(false)} theme={theme} />
      )}

      {showSignUpModal && (
        <SignUp onClose={() => setShowSignUpModal(false)} theme={theme} />
      )}

      <Routes>
        <Route path="/" element={<LandingPage theme={theme} />} />
        <Route path="/login" element={<Login theme={theme} />} />
        <Route path="/home" element={<Home theme={theme} />} />
        <Route path="/student-profile" element={<StudentProfile theme={theme} />} />
        <Route path="/signup" element={<SignUp theme={theme} />} />

        {/* Admin Dashboard */}
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

        {/* Librarian Dashboard */}
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

        {/* Student Dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['student']}>
                <StudentDashboard theme={theme} />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        {/* Add Librarian */}
        <Route
          path="/addLibrarian"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin']}>
                <AddLibrarian theme={theme} />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        {/* Add Student (admin or librarian) */}
        <Route
          path="/addStudent"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin', 'librarian']}>
                <AddStudent theme={theme} />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        {/* View Librarians */}
        <Route
          path="/viewLibrarians"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin']}>
                <ViewLibrarian theme={theme} />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        {/* View Students */}
        <Route
          path="/viewStudents"        // ✅ corrected route
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin', 'librarian']}>
                <ViewStudent theme={theme} />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

                {/* View Transactions */}
        <Route
          path="/viewAllTransactions"       
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin', 'librarian']}>
                <ViewAllTransactions theme={theme} />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        {/* Other routes */}
        <Route path="/viewAllBooks" element={<ViewAllBooks theme={theme} />} />
        <Route path="/admin-profile" element={<AdminProfile theme={theme} />} />
        <Route path="/addCategory" element={<AddCategory theme={theme} />} />
        <Route path="/viewCategory" element={<ViewCategories theme={theme} />} />
        <Route path="/addBook" element={<AddBook theme={theme} />} />

        {/* Additional CRUD operation routes */}
        <Route path="/updateBook" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Update Book Page - Coming Soon</div>} />
        <Route path="/deleteBook" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete Book Page - Coming Soon</div>} />
        <Route path="/updateStudent" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Update Student Page - Coming Soon</div>} />
        <Route path="/deleteStudent" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete Student Page - Coming Soon</div>} />
        <Route path="/updateCategory" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Update Category Page - Coming Soon</div>} />
        <Route path="/deleteCategory" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete Category Page - Coming Soon</div>} />
        <Route path="/updateLibrarian" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Update Librarian Page - Coming Soon</div>} />
        <Route path="/deleteLibrarian" element={<div className={`p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete Librarian Page - Coming Soon</div>} />
        <Route path="/contact" element={<ContactUsPage theme={theme}/>} />
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
