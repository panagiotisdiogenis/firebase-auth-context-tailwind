import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { query, where, doc, onSnapshot, collection, orderBy, limit } from "firebase/firestore"
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import Post from './Post'
import Modal from './Modal'
import Nav from './Nav'
import Loader from './Loader'

const Status = () => {

  const { showModal, currentPost, setCurrentPost } = usePost()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { postid } = useParams()
  const { username } = useAuth()

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "posts", postid), (doc) => {
      if (!doc.exists()) {
        setCurrentPost(null)
        navigate(`p/${username}`)
      } else {
        const data = { ...doc.data(), id: doc.id }
        setCurrentPost(data)
      }
    })

    return () => unsubscribe()
  }, [navigate, username, postid, setCurrentPost])

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, where('postID', '==', postid), orderBy('createdAt', "desc"), limit(10))
    const unsubscribe = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      setComments(snap)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [postid])

  if (!currentPost) return null

  return (
    <>
      <Nav />
      <div className="mx-auto mt-[63px] sm:mt-[70px] bg-gray-50 h-auto h-full dark:bg-[#111]">
        {loading ?
          <div className='mx-auto mt-32 flex items-center justify-center'>
            <Loader />
          </div>
          :
          <div className='flex flex-col items-center px-4 py-6'>
            <div className='flex items-center justify-center relative mb-4 h-[40px] w-full max-w-xl'>
              <button onClick={() => navigate(-1)} className="absolute top-0 left-0 mr-4 text-gray-900 bg-white text-sm border border-gray-300 focus:outline-none hover:bg-gray-100 rounded-full p-3 py-2 dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-[#111] dark:focus:ring-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className='ml-2 inline text-black dark:text-white'>Back</span>
              </button>
              <div className='mx-auto  text-slate-900 dark:text-white text-xl font-bold text-center'>Post</div>
            </div>
            <Post post={currentPost} key={currentPost.id} highlightedPost={true} />
            {comments ? comments.map((post) => <Post post={post} key={post.id} />) : null}
          </div>
        }
        {showModal ? <Modal /> : null}
      </div>
    </>
  )
}

export default Status




