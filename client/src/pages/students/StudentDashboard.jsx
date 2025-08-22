import React,{useEffect} from "react";
import { useAuth } from "../../context/authContext";
import {useNavigate} from 'react-router-dom';


const StudentDashboard =()=>{
    const {user,loading,logout}=useAuth()
    const navigate= useNavigate()

    const handleLogout= async (e) => {
        e.preventDefault();
        try{
            logout();
            navigate("/login"); //optional: navigate after logout
        }catch(error){
            console.log(error);
        }
    };

    //Protect route: redirect if not logged in
    useEffect(()=>{
        if(!loading && !user){
            navigate("/login");
        }
    },[loading,user,navigate]);

    return(<>
            <div>Student Dashboard</div>
            <h2>Wel-Come {user && user.name} </h2>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" >
                Logout</button>
        </>
    )
}

export default StudentDashboard;