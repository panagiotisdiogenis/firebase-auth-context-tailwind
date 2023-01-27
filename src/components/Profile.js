import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { doc, updateDoc, query, where, getDocs, onSnapshot, collection, orderBy, limit, startAfter, arrayRemove, arrayUnion } from "firebase/firestore"
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import { useFollowing } from '../context/FollowingContext'
import Post from './Post'
import Modal from './Modal'
import Loader from './Loader'
import Nav from './Nav'

const Profile = () => {
  const navigate = useNavigate()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
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
    setShowModal,
    setCurrentPost,
    requestedUser,
    setRequestedUser,
    setCreatePostOrigin
  } = usePost()
  const {
    requestedUserFollowers,
    setRequestedUserFollowers,
    requestedUserFollowing,
    setRequestedUserFollowing
  } = useFollowing()

  // validate if the user in the url requested exists, otherwise redirect to /404
  useEffect(() => {
    setLoading(true)
    setPosts([])
    setRequestedUser(null)
    setCurrentPost(null)
    setCreatePostOrigin(null)
    const ref = collection(db, 'users')
    const q = query(ref, where('username', '==', username))
    const unsubscribeUser = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))[0]
      if (!snap) navigate('/404')
      setRequestedUser(snap)
    })
    return () => unsubscribeUser()
  }, [username, navigate, setRequestedUser, setCurrentPost, setRequestedUserFollowing, setRequestedUserFollowers, setCreatePostOrigin, setPosts])

  useEffect(() => {
    const ref = collection(db, 'following')
    const q = query(ref, where('username', '==', username))
    const unsubscribe = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))[0]
      setRequestedUserFollowers({ followers: snap.followers, uid: snap.uid })
      setRequestedUserFollowing({ following: snap.following, uid: snap.uid })
    })
    return () => unsubscribe()
  }, [username, setRequestedUserFollowers, setRequestedUserFollowing])

  // fetch first batch of posts
  useEffect(() => {
    // setLoading(true)
    const ref = collection(db, 'posts')
    const q = query(ref, where('username', '==', username), where('postID', '==', null), orderBy('createdAt', "desc"), limit(10))
    const unsubscribe = onSnapshot(q, snapshot => {
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

    return () => unsubscribe()
  }, [username, navigate, setLastKey, setPosts, count])

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

  const getTimeJoined = () => {
    if (requestedUser) {
      let createdAt = requestedUser.createdAt.split(' ')
      return `Joined ${createdAt[2]} ${createdAt[3]}`
    }
  }

  const getFollowing = () => requestedUserFollowers.followers.includes(user.username) ? 'Unfollow' : 'Follow'

  const handleClickFollow = () => {
    const requestedUserRef = doc(db, 'following', requestedUser.uid)
    const loggedInUserRef = doc(db, 'following', user.uid)

    if (requestedUserFollowers.followers.includes(user.username)) {
      // delete user in requested user followers
      updateDoc(requestedUserRef, { followers: arrayRemove(user.username) })
      // delete user in logged in user following
      updateDoc(loggedInUserRef, { following: arrayRemove(requestedUser.username) })
    } else {
      // add user in requested user followers
      updateDoc(requestedUserRef, { followers: arrayUnion(user.username) })
      // add user in logged in user following
      updateDoc(loggedInUserRef, { following: arrayUnion(requestedUser.username) })
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
      <div className="mx-auto mt-[63px] sm:mt-[70px] bg-gray-50 h-auto dark:bg-[#111]">
        {loading || (!requestedUser || !requestedUserFollowing || !requestedUserFollowing) ?
          <div className='mx-auto mt-32 flex items-center justify-center'>
            <Loader />
          </div>
          :
          <div className='flex flex-col items-center px-4 py-6'>
            <div className="w-full max-w-xl bg-white border border-[#dbdbdb] rounded-lg mb-4 dark:bg-black dark:border-[#333]">
              <div className="flex flex-col p-6 sm:p-10 relative">
                {user && user.username !== username ?
                  <button onClick={handleClickFollow} className="absolute m-6 sm:m-10 bottom-0 right-0 text-gray-900 bg-white text-sm sm:text-lg border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-full px-8 py-2 dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-[#111]">
                    {getFollowing()}
                  </button> : null}
                <div className="relative inline-flex items-center justify-center w-32 h-32  bg-gray-100 border border-[#dbdbdb] rounded-full dark:bg-[#111] dark:border-[#333]">
                  <span className="text-2xl text-gray-600 dark:text-white">{requestedUser.email[0].toUpperCase()}</span>
                  {user && user.username === username ?
                    <span className="flex absolute h-3 w-3 bottom-3 right-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    : null}
                </div>
                <div className="mt-4 font-bold text-xl text-slate-900 dark:text-white">@{requestedUser.username}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-500">{requestedUser.email}</div>
                <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 align-text-bottom text-zinc-600 mr-[4px] inline dark:text-zinc-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                  </svg>
                  {getTimeJoined()}
                </div>
                <div className='mt-2'>
                  <span onClick={() => navigate(`/p/${username}/following`)} className='text-black dark:text-white hover:underline underline-offset-4 decoration-1 cursor-pointer'>
                    <span className="text-xs text-slate-900 font-bold dark:text-white">{requestedUserFollowing.following.length}</span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-500 pr-2"> Following</span>
                  </span>
                  <span onClick={() => navigate(`/p/${username}/followers`)} className='text-black dark:text-white hover:underline underline-offset-4 decoration-1 cursor-pointer'>
                    <span className="text-xs text-slate-900 font-bold dark:text-white">{requestedUserFollowers.followers.length}</span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-500"> Followers </span>
                  </span>
                </div>
              </div>
            </div>
            {loading ?
              <div className='mt-8'><Loader /></div>
              :
              <>
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
              </>
            }
          </div>}
        {showModal ? <Modal /> : null}
      </div>
    </>
  )
}

export default Profile
