import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { query, where, getDocs, onSnapshot, collection, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import { useFollowing } from '../context/FollowingContext'
import Post from './Post'
import Modal from './Modal'
import Loader from './Loader'
import Nav from './Nav'

const Feed = () => {
  const navigate = useNavigate()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const {
    posts,
    setPosts,
    lastKey,
    setLastKey,
    nextPostsLoading,
    setNextPostsLoading,
    showModal,
    setShowModal,
  } = usePost()
  const {
    userFollowing,
    setUserFollowing
  } = useFollowing()

  useEffect(() => {
    if (!user) navigate('/signin')
    // setLoading(true)
    const ref = collection(db, 'following')
    const q = query(ref, where('username', '==', user.username))
    const unsubscribe = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))[0]
      // if (snap.following.length === 0) setLoading(false)
      let seed = ['user1', 'user2', 'user3']
      if (snap.following.length === 0) {
        setUserFollowing(seed)
      } else {
        setUserFollowing(snap.following)
      }
      const ref = collection(db, 'posts')
      const q = query(ref, where('username', 'in', snap.following.length === 0 ? seed : snap.following), where('postID', '==', null), orderBy('createdAt', "desc"), limit(10))
      const unsubscribe2 = onSnapshot(q, snapshot => {
        const snap = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        let last = snapshot.docs[snapshot.docs.length - 1]
        setLastKey(last)
        setPosts(snap)
        let imageCount = 0
        snap.forEach((post) => {
          if (post.image) imageCount++
        })
        if (count >= imageCount) {
          setLoading(false)
        }
      })
      return () => unsubscribe2()
    })
    return () => unsubscribe()
  }, [user, navigate, setLastKey, setPosts, setUserFollowing, count])

  const fetchMorePosts = async (key) => {
    if (key) {
      setNextPostsLoading(true)
      const ref = collection(db, 'posts')
      const q = query(ref, where('username', 'in', userFollowing), where('postID', '==', null), orderBy('createdAt', "desc"), startAfter(key), limit(10))
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

  const handleCreatePost = () => {
    if (!user) {
      navigate('/siginin')
    } else {
      setShowModal(!showModal)
    }
  }

  return (
    <>
      <Nav />
      {user ?
        <div className='sm:hidden absolute top-0 right-0 h-full w-full'>
          <div onClick={handleCreatePost} className='z-20 flex w-16 h-16 items-center fixed justify-center m-6 bottom-0 right-0 text-3xl bg-white border border-[#dbdbdb] dark:border-[#333] dark:bg-[#111] rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#333] dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        </div>
        : null}
      <div className='hidden'>{posts.map((post) => <img alt='' key={post.id} src={post.image} onLoad={() => setCount(prev => prev + 1)} />)}</div>
      <div className="mx-auto mt-[50px] sm:mt-[70px] bg-gray-50 h-auto dark:bg-[#111]">
        {loading ?
          <div className='mx-auto mt-32 flex items-center justify-center'>
            <Loader />
          </div>
          :
          <div className='flex flex-col items-center px-4 py-6'>
            <div className='flex relative w-full max-w-xl'>
              <div className='text-slate-900 dark:text-white text-xl font-bold mb-4 text-left'>For You</div>
            </div>
            {posts.length !== 0 ? posts.map((post) => <Post post={post} key={post.id} />) : null}
            <div className='m-4'>
              {nextPostsLoading ?
                <Loader />
                :
                <button onClick={() => fetchMorePosts(lastKey)} className="text-gray-900 bg-white text-sm border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-full p-4 dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-[#111] dark:focus:ring-0">
                  {lastKey ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg> : <span className='px-2'>You are up to date!</span>}
                </button>
              }
            </div>
          </div>}
        {showModal ? <Modal /> : null}
      </div>
    </>
  )
}

export default Feed
