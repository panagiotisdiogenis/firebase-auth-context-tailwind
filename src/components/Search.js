import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from './Nav'
import { useAuth } from '../context/AuthContext'
import { useFollowing } from '../context/FollowingContext'
import { usePost } from '../context/PostContext'
import { db } from '../firebase'
import { updateDoc, arrayUnion, arrayRemove, doc, getDocs, query, where, onSnapshot, collection } from "firebase/firestore"
import Loader from './Loader'

const Search = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { input } = usePost()
  const { userFollowing } = useFollowing()
  const [loading, setLoading] = useState(true)
  const [people, setPeople] = useState([])

  useEffect(() => {
    const ref = collection(db, 'users')
    const q = query(ref, where('username', '==', input))
    const unsubscribeUser = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))
      setPeople(snap)
      setLoading(false)
    })
    return () => unsubscribeUser()
  }, [input, navigate])

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

  const renderPerson = (person) => {
    const { username } = person
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

  return (
    <>
      <Nav />
      <div className="mx-auto mt-[63px] sm:mt-[70px] bg-gray-50 h-auto h-full dark:bg-[#111]">
        <div className='flex flex-col items-center px-4 py-6'>
          <div className='max-w-xl w-full'>
            {loading ?
              <div className='mx-auto mt-32 flex items-center justify-center'>
                <Loader />
              </div>
              :
              <>
                {people.length > 0 ?
                  <>
                    <div className='text-slate-900 dark:text-white text-lg font-bold mb-4'>People</div>
                    {people.map((person) => renderPerson(person))}
                  </>
                  :
                  <div className='text-slate-900 dark:text-white text-center text-lg font-bold mt-4 mb-8'>Sorry, no results were found.</div>
                }
                <div className='text-slate-900 dark:text-white text-lg font-bold mb-4'>Suggestions</div>
                {['user1', 'user2', 'user3'].map((username) => renderSuggestions(username))}
              </>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Search