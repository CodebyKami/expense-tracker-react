import React, { createContext, useState, useEffect } from 'react'
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const currentUser = getStorageItem('currentUser')
    const rememberMe = getStorageItem('rememberMe')
    
    if (currentUser && rememberMe) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const signup = (email, password, name) => {
    const users = getStorageItem('users') || []
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists')
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this should be hashed
      name,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    setStorageItem('users', users)

    // Auto login after signup
    const userSession = { id: newUser.id, email: newUser.email, name: newUser.name }
    setUser(userSession)
    setStorageItem('currentUser', userSession)
    setStorageItem('rememberMe', true)

    return newUser
  }

  const login = (email, password, rememberMe = false) => {
    const users = getStorageItem('users') || []
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const userSession = { id: user.id, email: user.email, name: user.name }
    setUser(userSession)
    setStorageItem('currentUser', userSession)
    setStorageItem('rememberMe', rememberMe)

    return user
  }

  const logout = () => {
    setUser(null)
    removeStorageItem('currentUser')
    removeStorageItem('rememberMe')
  }

  const updateProfile = (updates) => {
    const users = getStorageItem('users') || []
    const userIndex = users.findIndex(u => u.id === user.id)
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      setStorageItem('users', users)
      
      const updatedSession = { ...user, ...updates }
      setUser(updatedSession)
      setStorageItem('currentUser', updatedSession)
    }
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
