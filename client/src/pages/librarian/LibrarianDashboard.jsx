import React from "react";
import { useAuth } from "../../context/authContext";


const LibrarianDashboard =()=>{
    const {user}=useAuth()
    return(
        <div>Librarian DashBoard {user.name} </div>
    )
}

export default LibrarianDashboard;