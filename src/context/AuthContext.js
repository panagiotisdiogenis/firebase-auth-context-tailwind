import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password)

  const signin = (email, password) => signInWithEmailAndPassword(auth, email, password)

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  const logout = () => signOut(auth)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ logout, resetPassword, signup, signin, user }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)