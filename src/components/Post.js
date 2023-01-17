import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import { db } from '../firebase'
import { collection, doc, getDocs, deleteDoc, updateDoc, query, where, onSnapshot, orderBy, limit } from "firebase/firestore"

const timeSince = (date) => {
  let seconds = Math.floor((new Date() - date.toDate()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + 'y'
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + 'm'
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + 'd'
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + 'h'
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + 'm'
  return Math.floor(seconds) + 's'
}

const Post = ({ post }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  let liked = user ? post.likedBy[`${user.uid}`] : false
  let star = user ? post.star : false
  const { showModal, setShowModal, setCurrentPost } = usePost()
  const [comments, setComments] = useState([])

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, where('postID', '==', post.id), orderBy('createdAt', "desc"), limit(10))
    const unsubscribe = onSnapshot(q, snapshot => {
      const snap = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      setComments(snap)
    })

    return () => unsubscribe()
  }, [post])

  const handleClickLike = async (e) => {
    e.stopPropagation()
    if (user) {
      const bool = liked === undefined ? true : !liked
      const newLikes = bool ? post.likes + 1 : post.likes - 1
      const ref = doc(db, 'posts', post.id)
      updateDoc(ref, { [`likedBy.${user.uid}`]: liked === undefined ? true : !liked, likes: newLikes })
    }
  }

  const handleClickStar = async (e) => {
    e.stopPropagation()
    if (user && user.uid === post.uid) {
      const ref = doc(db, 'posts', post.id)
      updateDoc(ref, { star: !post.star })
    }
  }

  const handleClickDelete = async (e) => {
    e.stopPropagation()
    if (user && user.uid === post.uid) {

      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where("postID", "==", post.id))
      // delete comments of original post
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(async (document) => {
        const postDoc = doc(db, 'posts', document.id)
        await deleteDoc(postDoc)
      })
      // delete original post
      const postDoc = doc(db, "posts", post.id)
      await deleteDoc(postDoc)
    }
  }

  const handleClickComment = (e) => {
    e.stopPropagation()
    if (user) {
      console.log(showModal)
      setCurrentPost(post)
      setShowModal(!showModal)
    }
  }

  const handleClickPost = (e) => {
    e.stopPropagation()
    setCurrentPost(post)
    navigate(`/p/${post.username}/${post.id}`)
  }

  return (
    <>
      <div onClick={(e) => handleClickPost(e)} className="w-full max-w-xl p-6 mb-4 bg-white border border-[#dbdbdb] rounded-lg hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out">
        <div className='flex'>
          <div className="min-w-[48px] mr-6 relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 border border-gray-200 rounded-full">
            <span className="text-lg text-gray-600">{post.email[0].toUpperCase()}</span>
          </div>
          <div className=''>
            <div>
              <p className='text-[15px] text-slate-900 inline font-bold'>@{post.username} </p>
              <p className='text-[15px] text-zinc-600 inline font-medium'>{post.email} · </p>
              <p className='text-[15px] text-zinc-600 inline font-medium'>{timeSince(post.timestamp)}</p>
            </div>
            {post.text ? <p className="pt-2 text-[15px] text-slate-900">{post.text} </p> : null}
            {post.image ? <img src={post.image} className='mt-4 rounded-lg w-full' alt='upload' /> : null}
            <div className='mt-4'>
              <span className='group'>
                <svg onClick={(e) => handleClickLike(e)} xmlns="http://www.w3.org/2000/svg" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${liked ? 'text-[#FA1A7F]' : 'text-zinc-600'} w-5 h-5 align-text-bottom inline hover:text-[#FA1A7F] hover:cursor-pointer group-hover:text-[#FA1A7F]`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <p className={`${liked ? 'text-[#FA1A7F]' : 'text-zinc-600'} px-2 text-sm inline group-hover:text-[#FA1A7F]`}>{post.likes}</p>
              </span>
              <span className='group'>
                <svg onClick={(e) => handleClickComment(e)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-600 inline ml-4 align-text-bottom hover:cursor-pointer group-hover:text-[#1d9cef]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
                <p className='px-2 text-sm inline group-hover:text-[#1d9cef]'>{comments.length}</p>
              </span>
              <svg onClick={(e) => handleClickStar(e)} xmlns="http://www.w3.org/2000/svg" fill={`${star && post.uid === user.uid ? 'currentColor' : 'none'}`} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${star && post.uid === user.uid ? 'text-amber-500' : 'text-zinc-600'} inline align-text-bottom ml-4 hover:cursor-pointer hover:text-amber-500`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <svg onClick={(e) => handleClickDelete(e)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-600 inline align-text-bottom ml-8 hover:cursor-pointer hover:text-[#FA1A7F]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Post