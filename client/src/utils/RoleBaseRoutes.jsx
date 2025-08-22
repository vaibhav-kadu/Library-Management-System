import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const RoleBaseRoutes = ({children,requiredRole}) => {
    const {user,loading}=useAuth()
    console.log("user=>",user)
    

    if(loading){
        return <div>Loading...</div>
    }

    if(!requiredRole.includes(user.role)){
        <Navigate to='/unauthorize' />
    }

    return user ? children : <Navigate to='/login'/>    

}

export default RoleBaseRoutes