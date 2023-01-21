import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { query, where, doc, onSnapshot, collection, orderBy, limit } from "firebase/firestore"
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import Post from './Post'
import Modal from './Modal'

const Status = () => {

  const { showModal, currentPost, setCurrentPost } = usePost()
  const [comments, setComments] = useState([])
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
    })

    return () => unsubscribe()
  }, [postid])

  if (!currentPost) return null

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
        <Post post={currentPost} key={currentPost.id} />
        {comments ? comments.map((post) => <Post post={post} key={post.id} />) : null}
      </div>
      {showModal ? <Modal /> : null}
    </div>
  )
}

export default Status




