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
  const hiddenFileInput = useRef()
  const postsRef = collection(db, 'posts')
  const { setShowModal } = usePost()
  const {
    imageUpload,
    setImageUpload,
    text,
    setText,
    currentPost
  } = usePost()

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
        emailVerified: user.emailVerified,
        timestamp: new Date(),
        createdAt: serverTimestamp()
      }

      if (postID) {
        newPost['postID'] = postID
      }

      setShowModal(false)

      await addDoc(postsRef, { ...newPost, image: url })
        .then(() => {
          setText('')
          setImageUpload('')
          setUrl('')
          hiddenFileInput.current.value = ''
        })
        .catch((err) => console.log(err))

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
    hiddenFileInput.current.value = ''
  }

  return (
    <form className='w-full max-w-xl mb-4'>
      <div className="border border-[#dbdbdb] rounded-xl bg-gray-50 dark:bg-black dark:border-[#333]">
        <div className="p-6 sm:p-8 pb-0 bg-white rounded-t-xl dark:bg-black">
          <label htmlFor="comment" className="sr-only">Your comment</label>
          <textarea id="comment" autoFocus maxLength="280" value={text} onChange={(e) => setText(e.target.value)} rows="4" className="w-full p-4 outline-none resize-none text-xl text-gray-900 bg-white border-0 focus:ring-0 dark:bg-black dark:text-white placeholder-[#71767B]" placeholder={`${currentPost ? 'Add a comment...' : "What's happening?"}`} required></textarea>
          <div className='overflow-y-scroll max-h-64 rounded-xl'>
            {imageUpload ? <img src={URL.createObjectURL(imageUpload)} className='w-full rounded-xl' alt='preview' /> : null}
          </div>
        </div>
        <div className="flex items-center justify-between bg-white rounded-xl p-6 sm:p-8 border-[#dbdbdb] dark:bg-black dark:border-[#333]">
          <div className="flex pl-0 space-x-2">
            <button onClick={() => hiddenFileInput.current.click()} type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-[#111] dark:hover:text-white">
              <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
              <span className="sr-only">Upload image</span>
            </button>
            {imageUpload ?
              <label htmlFor="" className='bg-pink-100 text-pink-800 text-xs font-medium ml-2 px-4 py-0 my-[2px] rounded-full flex justify-center items-center max-w-[200px] dark:bg-[#111] dark:text-white dark:border dark:border-[#333]'>
                <svg onClick={handleRemoveImageUpload} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-pink-800 hover:cursor-pointer dark:text-white">
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
          <button disabled={imageUpload && url === '' ? true : false} onClick={handleCreatePost} type="button" className="disabled:cursor-not-allowed inline-flex items-center py-2 px-5 text-sm font-medium text-center text-white bg-[#0F1419] hover:bg-[#333] rounded-full focus:ring-4 focus:ring-gray-300 dark:bg-black dark:border-[1px] dark:border-[#333] dark:hover:bg-[#111] dark:focus:ring-0">
            {imageUpload && url === '' ?
              <svg aria-hidden="true" className="inline w-4 h-4 text-[#666] animate-spin fill-[#FA1A7F] dark:text-[#666]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            : 'Post'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default CreatePost
