import React from 'react'
import { Navigate } from 'react-router-dom'

const RoleBaseRoutes = ({childrean,requiredRole}) => {
    const {user,loading}=useAuth()

    if(loading){
        return <div>Loading...</div>
    }

    if(!requiredRole.includes(user.role)){
        <Navigate to='/unauthorize' />
    }

    return user ? childrean : <Navigate to='/login'/>    

}

export default RoleBaseRoutes