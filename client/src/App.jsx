
import { BrowserRouter ,Routes,Route } from 'react-router-dom';
import AddBooks from './pages/books/AddBooks';
import AddStudents from './pages/students/addStudents';
import ViewStudents from './pages/students/viewStudents';
import Login from './pages/Login';
import StudentDashboard from './pages/students/studentDashBoard';
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import ProfileAccountManagement from './pages/admin/ProfileAccountManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import ViewAllBooks from './pages/ViewAllBooks';

function App() {

  return (
     <BrowserRouter>
      <Routes>  
        <Route path="/" element={<ViewStudents/>} />
        <Route path="/addStudents" element={<AddStudents/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/student-dashboard' element={<StudentDashboard/>}/>
        <Route path="/librarian-dashboard" element={<LibrarianDashboard/>}/>

        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin']}>
              <AdminDashboard/>
            </RoleBaseRoutes>
          </PrivateRoutes>
          
        }></Route>

        <Route path='/viewAllBooks' element={<ViewAllBooks/>}/>

        <Route path='/profileAccountManagement' element={<ProfileAccountManagement/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
