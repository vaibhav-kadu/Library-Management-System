import React from "react";
import { useAuth } from "../../context/authContext";


const StudentDashboard =()=>{
    const {user}=useAuth()
    return(
        <div>Student DashBoard {user.name} </div>
    )
}

export default StudentDashboard;