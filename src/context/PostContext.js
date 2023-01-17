import { createContext, useContext, useState } from 'react'

const PostContext = createContext()

export const PostContextProvider = ({ children }) => {
  const [imageUpload, setImageUpload] = useState()
  const [showModal, setShowModal] = useState(false)
  const [currentPost, setCurrentPost] = useState()
  const [posts, setPosts] = useState([])
  const [lastKey, setLastKey] = useState()
  const [nextPostsLoading, setNextPostsLoading] = useState(false)

  const [loading, setLoading] = useState(true)
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
      loading,
      setLoading
    }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePost = () => useContext(PostContext)