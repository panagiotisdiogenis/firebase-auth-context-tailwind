import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
    setRequestedUserFollowing
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

  const handleClickFollow = async (username) => {

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

  if (!requestedUserFollowing || !requestedUserFollowing) return null

  return (
    <div className="mx-auto bg-gray-50 h-auto h-full dark:bg-[#111]">
      <div className='flex flex-col items-center p-4'>
        <div className='max-w-xl w-full'>
          <button onClick={() => navigate(-1)} className="text-gray-900 bg-white text-sm border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-full px-4 py-2 mb-4 dark:bg-black dark:border-[#333] dark:hover:bg-[#111] dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 inline align-text-bottom">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className='ml-2 inline font-bold text-slate-900 dark:text-white'>Back</span>
          </button>
        </div>
        {users && users[`${route}`].map((username, i) => {
          return (
            <div key={i} className='relative w-full max-w-xl p-6 mb-4 bg-white border border-[#dbdbdb] rounded-lg hover:cursor-pointer dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-black/50'>
              <div className='flex justify-between'>
                <div>
                  <div className="min-w-[48px] mr-6 relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 border border-gray-200 rounded-full dark:bg-[#111] dark:border-[#333]">
                    <span className="text-lg text-gray-600 dark:text-white">{username[0].toUpperCase()}</span>
                  </div>
                  @{username}
                </div>
                <button onClick={() => handleClickFollow(username)} className='flex text-gray-900 bg-white text-sm sm:text-lg border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-full px-8 py-2 dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-[#111]'>
                  {userFollowing.includes(username) ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Following