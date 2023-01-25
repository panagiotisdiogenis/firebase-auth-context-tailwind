import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Nav from './Nav'
import { useAuth } from '../context/AuthContext'
import { useFollowing } from '../context/FollowingContext'
import { db } from '../firebase'
import { updateDoc, arrayUnion, arrayRemove, doc, getDocs, query, where, onSnapshot, collection } from "firebase/firestore"

const Following = () => {
  const { pathname } = useLocation()
  const route = pathname.split('/')[3]
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    userFollowing,
    requestedUserFollowers,
    requestedUserFollowing,
    setRequestedUserFollowers,
    setRequestedUserFollowing,
    setUserFollowers,
    setUserFollowing
  } = useFollowing()
  const [users, setUsers] = useState()

  useEffect(() => {
    if (route === 'following') {
      setUsers(requestedUserFollowing)
    } else {
      setUsers(requestedUserFollowers)
    }
  }, [requestedUserFollowing, requestedUserFollowers, route])

  useEffect(() => {
    if (!user) {
      navigate('/siginin')
    } 
    const ref = collection(db, 'following')
    const q = query(ref, where('username', '==', user.username))
    const unsubscribe = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))[0]
      setUserFollowers(snap.followers)
      setUserFollowing(snap.following)
    })
    return () => unsubscribe()
  }, [user, navigate, setUserFollowers, setUserFollowing])

  useEffect(() => {
    const requestedUsername = pathname.split('/')[2]
    const ref = collection(db, 'following')
    const q = query(ref, where('username', '==', requestedUsername))
    const unsubscribe = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))[0]
      setRequestedUserFollowers({ followers: snap.followers, uid: snap.uid })
      setRequestedUserFollowing({ following: snap.following, uid: snap.uid })
    })
    return () => unsubscribe()
  }, [pathname, setRequestedUserFollowers, setRequestedUserFollowing])

  const handleClickFollow = async (e, username) => {
    e.stopPropagation()
    if (!user) {
      navigate('/siginin')
    } else {
      const q = query(collection(db, "users"), where("username", "==", username))
      const querySnapshot = await getDocs(q)
      let id = null
      querySnapshot.forEach((doc) => {
        id = doc.id
      })
      const requestedUserRef = doc(db, 'following', id)
      const loggedInUserRef = doc(db, 'following', user.uid)
  
      if (userFollowing.includes(username)) {
        // delete user in requested user followers
        updateDoc(requestedUserRef, { followers: arrayRemove(user.username) })
        // delete user in logged in user following
        updateDoc(loggedInUserRef, { following: arrayRemove(username) })
      } else {
        // add user in requested user followers
        updateDoc(requestedUserRef, { followers: arrayUnion(user.username) })
        // add user in logged in user following
        updateDoc(loggedInUserRef, { following: arrayUnion(username) })
      }
    }
  }

  const handleClickUser = (e, username) => {
    e.stopPropagation()
    setRequestedUserFollowers(null)
    setRequestedUserFollowing(null)
    navigate(`/p/${username}`)
  }

  const renderSuggestions = (username) => {
    if (userFollowing) {
      return (
        <div onClick={(e) => handleClickUser(e, username)} key={username} className='relative w-full max-w-xl p-6 mb-4 bg-white border border-[#dbdbdb] rounded-lg hover:cursor-pointer dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-black/50'>
          <div className='flex justify-between'>
            <div>
              <div className="min-w-[48px] mr-6 relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 border border-gray-200 rounded-full dark:bg-[#111] dark:border-[#333]">
                <span className="text-lg text-gray-600 dark:text-white">{username[0].toUpperCase()}</span>
              </div>
              <span className='text-sm sm:text-base'>@{username}</span>
            </div>
            <button onClick={(e) => handleClickFollow(e, username)} className='flex items-center justify-center text-gray-900 bg-white text-sm sm:text-md border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-full px-8 py-2 dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-[#111]'>
              {userFollowing.includes(username) ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        </div>
      )
    }
  }

  if (!userFollowing || !requestedUserFollowing || !requestedUserFollowing) return null

  return (
    <>
      <Nav />
      <div className="mx-auto mt-[50px] sm:mt-[70px] bg-gray-50 h-auto h-full dark:bg-[#111]">
        <div className='flex flex-col items-center px-4 py-6'>
          <div className='max-w-xl w-full'>
            {users && users[`${route}`].length !== 0 ? <div className='text-slate-900 dark:text-white text-lg font-bold mb-4'>{`${route.charAt(0).toUpperCase() + route.slice(1)}`}</div> : null}
            {users && users[`${route}`].map((username, i) => {
              return (
                <div onClick={(e) => handleClickUser(e, username)} key={i} className='relative w-full max-w-xl p-6 mb-4 bg-white border border-[#dbdbdb] rounded-lg hover:cursor-pointer dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-black/50'>
                  <div className='flex justify-between'>
                    <div>
                      <div className="min-w-[48px] mr-6 relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 border border-gray-200 rounded-full dark:bg-[#111] dark:border-[#333]">
                        <span className="text-lg text-gray-600 dark:text-white">{username[0].toUpperCase()}</span>
                      </div>
                      <span className='text-sm sm:text-base'>@{username}</span>
                    </div>
                    <button onClick={(e) => handleClickFollow(e, username)} className='flex items-center justify-center text-gray-900 bg-white text-sm sm:text-md border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-full px-8 py-2 dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-[#111]'>
                      {userFollowing.includes(username) ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                </div>
              )
            })}
            <div className='text-slate-900 dark:text-white text-lg font-bold mb-4'>Suggestions</div>
            {['user1', 'user2', 'user3'].map((username) => renderSuggestions(username))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Following