import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { query, where, doc, onSnapshot, collection, orderBy, limit } from "firebase/firestore"
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import Post from './Post'
import Modal from './Modal'
import Nav from './Nav'

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
    <>
      <Nav />
      <div className="mx-auto mt-[50px] sm:mt-[70px] bg-gray-50 h-auto h-full dark:bg-[#111]">
        <div className='flex flex-col items-center px-4 py-6'>
          <div className='max-w-xl w-full'>
          </div>
          <Post post={currentPost} key={currentPost.id} highlightedPost={true} />
          {comments ? comments.map((post) => <Post post={post} key={post.id} />) : null}
        </div>
        {showModal ? <Modal /> : null}
      </div>
    </>
  )
}

export default Status




