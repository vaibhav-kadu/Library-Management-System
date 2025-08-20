
import { BrowserRouter ,Routes,Route } from 'react-router-dom';
import AddBooks from './pages/books/AddBooks';
import AddStudents from './pages/students/addStudents';
import ViewStudents from './pages/students/viewStudents';
import Login from './pages/login';
import StudentDashboard from './pages/students/studentDashBoard';
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import AdminDashboard from './pages/admin/adminDashBoard';

function App() {

  return (
     <BrowserRouter>
      <Routes>  
        <Route path="/" element={<ViewStudents/>} />
        <Route path="/addStudents" element={<AddStudents/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/student-dashboard' element={<StudentDashboard/>}/>
        <Route path="/librarian-dashboard" element={<LibrarianDashboard/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
