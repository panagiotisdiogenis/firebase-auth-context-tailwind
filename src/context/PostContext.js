import { createContext, useContext, useState } from 'react'

const PostContext = createContext()

export const PostContextProvider = ({ children }) => {
  const [imageUpload, setImageUpload] = useState()
  const [showModal, setShowModal] = useState(false)
  const [currentPost, setCurrentPost] = useState()
  const [posts, setPosts] = useState([])
  const [lastKey, setLastKey] = useState()
  const [nextPosts_loading, setNextPostsLoading] = useState(false)

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
      nextPosts_loading,
      setNextPostsLoading,
      currentPost,
      setCurrentPost
    }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePost = () => useContext(PostContext)