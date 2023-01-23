import { createContext, useContext, useState } from 'react'

const FollowingContext = createContext()

export const FollowingContextProvider = ({ children }) => {
  const [requestedUserFollowers, setRequestedUserFollowers] = useState()
  const [requestedUserFollowing, setRequestedUserFollowing] = useState()

  return (
    <FollowingContext.Provider value={{
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