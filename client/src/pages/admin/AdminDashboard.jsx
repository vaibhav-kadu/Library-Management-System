import React from "react";
import { useAuth } from "../../context/authContext";


const AdminDashboard =()=>{
    const {user}=useAuth()
    return(
        <div>Admin DashBoard {user.name} </div>
    )
}

export default AdminDashboard;