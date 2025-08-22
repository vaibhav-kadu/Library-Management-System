import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const PrivateRoutes = ({childrean}) => {
    const {user,loading}=useAuth()

    if(loading){
        return <div>Loading...</div>
    }

    return user ? childrean : <Navigate to='/login'/>

}

export default PrivateRoutes