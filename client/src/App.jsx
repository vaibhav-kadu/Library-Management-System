
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import AddBooks from './pages/books/AddBooks';
import AddStudents from './pages/students/addStudents';
import ViewStudents from './pages/students/viewStudents';

function App() {

  return (
     <Router>
      <Routes>  
        <Route path="/" element={<ViewStudents/>} />
        <Route path="/addStudents" element={<AddStudents/>} />
      </Routes>
    </Router>
  );
}

export default App
