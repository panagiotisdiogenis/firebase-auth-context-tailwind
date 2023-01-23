import { createContext, useContext, useState } from 'react'
// import { useAuth } from '../context/AuthContext'
// import { db } from '../firebase'
// import {  query, where, onSnapshot, collection } from "firebase/firestore"
const FollowingContext = createContext()

export const FollowingContextProvider = ({ children }) => {
  const [userFollowers, setUserFollowers] = useState()
  const [userFollowing, setUserFollowing] = useState()
  const [requestedUserFollowers, setRequestedUserFollowers] = useState()
  const [requestedUserFollowing, setRequestedUserFollowing] = useState()

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