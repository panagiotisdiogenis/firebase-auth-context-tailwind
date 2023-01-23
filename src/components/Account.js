import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'

const Account = () => {

  const navigate = useNavigate()
  const { user, logout, setUser } = useAuth()
  const { setPosts } = usePost()

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      setPosts([])
      navigate('/')
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-[#111]">
      <div className='flex flex-col items-center justify-center px-4 mx-auto h-screen'>
        <div className="w-full max-w-sm bg-white border border-[#dbdbdb] rounded-xl dark:bg-black dark:border-[#333]">
          <div className="flex flex-col items-center p-10 rounded-xl dark:bg-black">
            <div className="relative inline-flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-100 border border-[#dbdbdb] rounded-full dark:bg-[#111] dark:border-[#333]">
              <span className="text-xl text-gray-600 dark:text-white">{user.username[0].toUpperCase()}</span>
            </div>
            <div className="mt-8 font-bold text-xl text-slate-900 dark:bg-black dark:border-[#333] dark:text-white">@{user.username}</div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-white">{user.email}</div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-white">#{user.uid}</div>
            <div className="flex mt-6 space-x-4">
              <button onClick={() => navigate(`/p/${user.username}`)} className="w-20 block items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-[#dbdbdb] rounded-lg hover:bg-gray-100 dark:bg-[#111] dark:text-white dark:border-[#333] dark:hover:bg-[#333]">Home</button>
              <button onClick={handleLogout} className="w-20 block items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-md hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-0">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default Account