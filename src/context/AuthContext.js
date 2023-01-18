import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../firebase'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  const signup = (email, password, username) => {
    return createUserWithEmailAndPassword(auth, email, password, username)
      .then(async (userCredential) => {
        sendEmailVerification(auth.currentUser)
        const ref = doc(db, 'users', userCredential.user.uid)
        await setDoc(ref, {
          createdAt: userCredential.user.metadata.creationTime,
          email: userCredential.user.email,
          username
        })
      })
  }

const signin = (email, password) => signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
  console.log(userCredential)
  if (userCredential.user.emailVerified) {
    const ref = doc(db, 'users', userCredential.user.uid)
    await updateDoc(ref, { emailVerified: userCredential.user.emailVerified })
  }
})

const resetPassword = (email) => sendPasswordResetEmail(auth, email)

const logout = () => signOut(auth)

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const ref = doc(db, 'users', currentUser.uid)
      const snapshot = await getDoc(ref)
      setUser({ ...snapshot.data(), uid: currentUser.uid })
    }
    setLoading(false)
  })

  return unsubscribe
}, [])

return (
  <AuthContext.Provider value={{ loading, setUser, setLoading, logout, resetPassword, signup, signin, user }}>
    {!loading && children}
  </AuthContext.Provider>
)
}

export const useAuth = () => useContext(AuthContext)