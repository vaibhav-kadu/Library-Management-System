
import { BrowserRouter ,Routes,Route } from 'react-router-dom';
import AddStudents from './pages/students/StudentRegister';
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
import LandingPage from './pages/landingpage';

function App() {

  return (
     <BrowserRouter>
      <Routes>  
        <Route path="/addStudents" element={<AddStudents/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/student-dashboard' element={<StudentDashboard/>}/>
        <Route path='/student-profile' element={<StudentProfile/>}/>
        <Route path="/librarian-dashboard" element={<LibrarianDashboard/>}/>

        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin']}>
              <AdminDashboard/>
            </RoleBaseRoutes>
          </PrivateRoutes>
          
        }></Route>
        <Route path='/addLibrarian' element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin']}>
              <AddLibrarian/>
            </RoleBaseRoutes>
          </PrivateRoutes>
        }></Route>

        <Route path='/addStudents' element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin','librarian']}>
              <AddStudents/>
            </RoleBaseRoutes>
          </PrivateRoutes>
        }></Route>

        <Route path='/viewAllBooks' element={<ViewAllBooks/>}/>

        <Route path='/profileAccountManagement' element={<ProfileAccountManagement/>} />

         <Route path='/addCategory' element={<AddCategory/>}/>
         <Route path='/viewCategory' element={<ViewCategories/>}/>

          <Route path='/addBook' element={<AddBook/>}/>

          <Route path='/' element={<LandingPage/>}/>








      </Routes>
    </BrowserRouter>
  );
}

export default App
