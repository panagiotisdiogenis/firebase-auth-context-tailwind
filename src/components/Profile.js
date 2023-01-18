import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { query, where, getDocs, onSnapshot, collection, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import CreatePost from './CreatePost'
import Post from './Post'
import Modal from './Modal'
import Loader from './Loader'

const Profile = () => {
  const navigate = useNavigate()
  const { username } = useParams()
  const { user } = useAuth()
  const {
    posts,
    setPosts,
    lastKey,
    setLastKey,
    nextPostsLoading,
    setNextPostsLoading,
    showModal,
    requestedUser,
    setRequestedUser
  } = usePost()

  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // set loader if images are still loading
  useEffect(() => {
    setLoading(true)
    let imageCount = 0
    posts.forEach((post) => {
      if (post.image) imageCount++
    })
    if (count >= imageCount) {
      setLoading(false)
    }
  }, [count, posts])

  // validate if the user in the url requested exists, otherwise redirect to /404
  useEffect(() => {
    const ref = collection(db, 'users')
    const q = query(ref, where('username', '==', username))
    const unsubscribeUser = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))[0]
      if (!snap) navigate('/404')
      setRequestedUser(snap)
    })
    return () => unsubscribeUser()
  }, [username, navigate, setRequestedUser])

  // fetch first batch of posts
  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, where('username', '==', username), where('postID', '==', null), orderBy('createdAt', "desc"), limit(10))
    const unsubscribe = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      let last = snapshot.docs[snapshot.docs.length - 1]
      setLastKey(last)
      setPosts(snap)
    })

    return () => unsubscribe()
  }, [username, navigate, setLastKey, setPosts])

  // fetch next batch of posts
  const fetchMorePosts = async (key) => {
    if (key) {
      setNextPostsLoading(true)
      const ref = collection(db, 'posts')
      const q = query(ref, where('username', '==', username), where('postID', '==', null), orderBy('createdAt', "desc"), startAfter(key), limit(10))
      let nextPosts = []
      const snapshot = await getDocs(q)
      snapshot.forEach((doc) => {
        nextPosts.push({ ...doc.data(), id: doc.id })
      })
      setLastKey(nextPosts[nextPosts.length - 1])
      setPosts(posts.concat(nextPosts))
      setNextPostsLoading(false)
    }
  }

  if (!requestedUser) return null

  let createdAt = requestedUser.createdAt.split(' ')
  let joined = `Joined ${createdAt[2]} ${createdAt[3]}`

  return (
    <div className="container mx-auto bg-gray-50 h-screen">
      <div className='flex flex-col items-center px-4 py-6'>
        <div className="w-full max-w-xl bg-white border border-[#dbdbdb] rounded-lg mb-4">
          <div className="flex flex-col p-10 relative">
            {user && user.username === username ? <button onClick={() => navigate('/account')} className="absolute m-10 top-0 right-0 text-gray-900 bg-white text-sm border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-full px-4 py-2">
              Edit profile
            </button>
              : null}
            <div className="relative inline-flex items-center justify-center w-32 h-32  bg-gray-100 border border-[#dbdbdb] shadow-xs rounded-full">
              <span className="text-2xl text-gray-600">{requestedUser.email[0].toUpperCase()}</span>
              {user && user.username === username ?
                <span className="flex absolute h-3 w-3 bottom-3 right-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                : null}
            </div>
            <div className="mt-4 font-bold text-xl text-slate-900">@{requestedUser.username}</div>
            <div className="text-sm text-zinc-600">{requestedUser.email}</div>
            <div className="mt-4 text-sm text-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 align-text-bottom text-zinc-600 mr-[4px] inline">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              {joined}
            </div>
          </div>
        </div>
        {user && user.username === username ? <CreatePost /> : null}
        <div className='hidden'>
          {posts.map((post) => <img alt='' key={post.id} src={post.image} onLoad={() => setCount(prev => prev + 1)} />)}
        </div>
        {loading ?
        <div className='mt-8'><Loader /></div>
        :
          <>
            {posts.length !== 0 ? posts.map((post) => <Post post={post} key={post.id} />) : null}
            <div className='m-4'>
              {nextPostsLoading ?
                <p>Loading...</p>
                :
                <button onClick={() => fetchMorePosts(lastKey)} className="text-gray-900 bg-white text-sm border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-full p-4">
                  {lastKey ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg> : <span className='px-2'>You are up to date!</span>}
                </button>
              }
            </div>
          </>
        }

      </div>
      {showModal ? <Modal /> : null}
    </div>
  )
}

export default Profile
