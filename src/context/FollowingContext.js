import { createContext, useContext, useState } from 'react'

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