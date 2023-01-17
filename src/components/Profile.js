import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { query, where, getDocs, onSnapshot, collection, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import CreatePost from './CreatePost'
import Post from './Post'
import Modal from './Modal'

const Profile = () => {
  const navigate = useNavigate()
  const { username } = useParams()
  const [currentUser, setCurrentUser] = useState()
  const { user } = useAuth()
  const {
    posts,
    setPosts,
    lastKey,
    setLastKey,
    nextPostsLoading,
    setNextPostsLoading,
    showModal,
    loading,
  } = usePost()

  // validate if the user in the url requested exists, otherwise redirect to /404
  useEffect(() => {
    const ref = collection(db, 'users')
    const q = query(ref, where('username', '==', username))
    const unsubscribeUser = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))[0]
      if (!snap) navigate('/404')
      setCurrentUser(snap)
    })
    return () => unsubscribeUser()
  }, [username, navigate])

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

  if (!currentUser) return null

  let createdAt = currentUser.createdAt.split(' ')
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
              <span className="text-2xl text-gray-600">{currentUser.email[0].toUpperCase()}</span>
              {user && user.username === username ?
                <span className="flex absolute h-3 w-3 bottom-3 right-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                : null}
            </div>
            <div className="mt-4 font-bold text-xl text-slate-900">@{currentUser.username}</div>
            <div className="text-sm text-zinc-600">{currentUser.email}</div>
            <div className="mt-4 text-sm text-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 align-text-bottom text-zinc-600 mr-[4px] inline">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              {joined}
            </div>
          </div>
        </div>
        {user && user.username === username ? <CreatePost /> : null}
        {posts.length !== 0 ? posts.map((post) => <Post post={post} key={post.id} />) : null}
        {loading ?
          <svg aria-hidden="true" className="inline w-8 h-8 mt-8 text-gray-200 animate-spin fill-[#FA1A7F]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          :
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
          </div>}
      </div>
      {showModal ? <Modal /> : null}
    </div>
  )
}

export default Profile
