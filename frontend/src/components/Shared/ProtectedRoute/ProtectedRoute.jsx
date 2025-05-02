import React from "react"
import { Navigate } from "react-router-dom" 

export default function ProtectedRoute({ children, adminOnly=false }) {
  
    const token = localStorage.getItem('token')
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) 

    if (!token) {
        return <Navigate to="/login" />
    }

    if (userInfo?.data?.role !== 'admin' && adminOnly) {
        return <Navigate to="/" />
    }

    return children
}