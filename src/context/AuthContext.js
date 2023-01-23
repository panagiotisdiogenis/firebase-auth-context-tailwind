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
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        sendEmailVerification(auth.currentUser)
        const ref = doc(db, 'users', userCredential.user.uid)
        await setDoc(ref, {
          createdAt: userCredential.user.metadata.creationTime,
          emailVerified: userCredential.user.emailVerified,
          email: userCredential.user.email,
          username
        })
        const followRef = doc(db, 'following', userCredential.user.uid)
        await setDoc(followRef, {
          username,
          followers: [],
          following: []
        })
      })
  }

  const signin = (email, password) => signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
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

  const [theme, setTheme] = useState()

  useEffect(() => {
    if (!('theme' in localStorage)) {
      localStorage.theme = 'dark'
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
      document.body.style.backgroundColor = '#111'
    } else {
      setTheme('light')
      document.documentElement.classList.remove('dark')
      document.body.style.backgroundColor = '#fafafa'
    }
  }, [theme])

  const handleThemeSwitch = () => {
    if (theme === 'dark') {
      setTheme('light')
      localStorage.theme = 'light'
    } else {
      setTheme('dark')
      localStorage.theme = 'dark'
    }
  }

  return (
    <AuthContext.Provider value={{ loading, setUser, setLoading, logout, resetPassword, signup, signin, user, handleThemeSwitch, theme }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)