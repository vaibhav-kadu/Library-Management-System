import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorize" />
  }

  return children
}


export default RoleBaseRoutes
