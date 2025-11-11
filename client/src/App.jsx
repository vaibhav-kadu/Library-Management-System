import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css'; // Custom theme CSS

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
import LandingPage from './pages/LandingPage.jsx';
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
    // Apply theme to body
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
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
        <Route path="/contact" element={<ContactUsPage theme={theme}/>} />
        <Route path="/viewAllBooks" element={<ViewAllBooks theme={theme} />} />

        {/* Admin Routes */}
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
        <Route path="/admin-profile" element={<AdminProfile theme={theme} />} />

        {/* Librarian Routes */}
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

        {/* Student Routes */}
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
        <Route
          path="/viewStudents"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin', 'librarian']}>
                <ViewStudent theme={theme} />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        {/* Transaction Routes */}
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

        {/* Book Routes */}
        <Route path="/addBook" element={<AddBook theme={theme} />} />

        {/* Category Routes */}
        <Route path="/addCategory" element={<AddCategory theme={theme} />} />
        <Route path="/viewCategory" element={<ViewCategories theme={theme} />} />
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