import { useState, useRef } from 'react'
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage"
import { storage } from "../firebase"
import { v4 } from 'uuid'

const CreatePost = ({ postID }) => {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const hiddenFileInput = useRef()
  const postsRef = collection(db, 'posts')
  const { imageUpload, setImageUpload } = usePost()
  const { setShowModal } = usePost()

  const [url, setUrl] = useState('')

  const handleCreatePost = async () => {

    if (text || imageUpload) {

      let newPost = {
        text,
        likes: 0,
        likedBy: {},
        postID: null,
        star: false,
        uid: user.uid,
        email: user.email,
        username: user.username,
        timestamp: new Date(),
        createdAt: serverTimestamp()
      }

      if (postID) {
        newPost['postID'] = postID
      }

      await addDoc(postsRef, { ...newPost, image: url })
        .then(() => {
          setText('')
          setImageUpload('')
          setUrl('')
          hiddenFileInput.current.value = ''
        })
        .catch((err) => console.log(err))

      setShowModal(false)
    }
  }

  const handleChange = (image) => {
    if (image) {
      setImageUpload(image)
      const imageRef = ref(storage, `images/${image.name}-${v4()}`);
      uploadBytes(imageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setUrl(url)
        })
      })
    }
  }

  const handleRemoveImageUpload = () => {
    setImageUpload('')
    setUrl('')
  }

  return (
    <form className='w-full max-w-xl mb-4'>
      <div className="border border-[#dbdbdb] rounded-lg bg-gray-50">
        <div className="px-4 py-2 bg-white rounded-t-lg">
          <label htmlFor="comment" className="sr-only">Your comment</label>
          <textarea id="comment" maxLength="280" value={text} onChange={(e) => setText(e.target.value)} rows="4" className="w-full p-4 outline-none resize-none text-md text-gray-900 bg-white border-0 focus:ring-0" placeholder="What's happening?" required></textarea>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t border-[#dbdbdb]">
          <div className="flex pl-0 space-x-1 sm:pl-2">
            <button onClick={() => hiddenFileInput.current.click()} type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100">
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
              <span className="sr-only">Upload image</span>
            </button>
            {imageUpload ?
              <label htmlFor="hell" className='bg-pink-100 text-pink-800 text-xs font-medium ml-2 px-4 py-0 my-[2px] rounded-full flex justify-center items-center max-w-[200px]'>
                <svg onClick={handleRemoveImageUpload} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-pink-800 hover:cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {imageUpload ? imageUpload.name.replace(/(.{14})..+/, "$1…") : null}
              </label> : null}
            <input
              id="hello"
              type="file"
              accept="image/*"
              ref={hiddenFileInput}
              className='hidden'
              onChange={(e) => handleChange(e.target.files[0])}
            />
          </div>
          <button onClick={handleCreatePost} type="button" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-[#0F1419] hover:bg-[#333] rounded-full focus:ring-4 focus:ring-gray-300">
            Create Post
          </button>
        </div>
      </div>
    </form>
  )
}

export default CreatePost
