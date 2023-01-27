import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

import { db } from '../firebase'
import {  query, where, onSnapshot, collection } from "firebase/firestore"
const FollowingContext = createContext()

export const FollowingContextProvider = ({ children }) => {
  const [userFollowers, setUserFollowers] = useState()
  const [userFollowing, setUserFollowing] = useState()
  const [requestedUserFollowers, setRequestedUserFollowers] = useState()
  const [requestedUserFollowing, setRequestedUserFollowing] = useState()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/siginin')
    } else {
      const ref = collection(db, 'following')
      const q = query(ref, where('username', '==', user.username))
      const unsubscribe = onSnapshot(q, snapshot => {
        const snap = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))[0]
        setUserFollowers(snap.followers)
        setUserFollowing(snap.following)
      })
      return () => unsubscribe()
    }
  }, [user, navigate, setUserFollowers, setUserFollowing])

  return (
    <FollowingContext.Provider value={{
      userFollowers,
      setUserFollowers,
      userFollowing,
      setUserFollowing,
      requestedUserFollowers,
      setRequestedUserFollowers,
      requestedUserFollowing,
      setRequestedUserFollowing,
    }}>
      {children}
    </FollowingContext.Provider>
  )
}

export const useFollowing = () => useContext(FollowingContext)