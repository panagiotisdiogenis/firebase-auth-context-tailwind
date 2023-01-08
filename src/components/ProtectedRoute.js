import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  console.log("hey", user)
  return user ? children : <Navigate to='/signin' />
};

export default ProtectedRoute