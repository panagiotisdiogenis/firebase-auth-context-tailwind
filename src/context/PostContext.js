import { createContext, useContext, useState } from 'react'

const PostContext = createContext()

export const PostContextProvider = ({ children }) => {
  const [imageUpload, setImageUpload] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentPost, setCurrentPost] = useState()
  const [posts, setPosts] = useState([])
  const [lastKey, setLastKey] = useState()
  const [nextPostsLoading, setNextPostsLoading] = useState(false)
  const [requestedUser, setRequestedUser] = useState()
  const [text, setText] = useState('')
  const [createPostOrigin, setCreatePostOrigin] = useState()
  const [input, setInput] = useState('')
  
  return (
    <PostContext.Provider value={{
      imageUpload,
      setImageUpload,
      showModal,
      setShowModal,
      posts,
      setPosts,
      lastKey,
      setLastKey,
      nextPostsLoading,
      setNextPostsLoading,
      currentPost,
      setCurrentPost,
      requestedUser,
      setRequestedUser,
      text,
      setText,
      createPostOrigin,
      setCreatePostOrigin,
      input,
      setInput
    }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePost = () => useContext(PostContext)