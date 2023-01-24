import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'

const Account = () => {
  const navigate = useNavigate()
  const { user, logout, setUser, handleThemeSwitch, theme } = useAuth()
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
        <div className="w-full max-w-lg bg-white border border-[#dbdbdb] rounded-xl dark:bg-black dark:border-[#333]">
          <div className="flex flex-col items-center p-10 rounded-xl dark:bg-black">
            <div className="relative inline-flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-100 border border-[#dbdbdb] rounded-full dark:bg-[#111] dark:border-[#333]">
              <span className="text-xl text-gray-600 dark:text-white">{user.username[0].toUpperCase()}</span>
            </div>
            <div className="mt-8 font-bold text-xl text-slate-900 dark:bg-black dark:border-[#333] dark:text-white">@{user.username}</div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-white">{user.email}</div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-white">#{user.uid}</div>
            <div className="flex mt-6 space-x-4">
              <button onClick={() => navigate(`/p/${user.username}`)} className="w-20 block items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-[#dbdbdb] rounded-lg hover:bg-gray-100 dark:bg-[#111] dark:text-white dark:border-[#333] dark:hover:bg-[#333]">Home</button>
              <button onClick={() => handleThemeSwitch()} className="w-20 block items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-[#dbdbdb] rounded-lg hover:bg-gray-100 dark:bg-[#111] dark:text-white dark:border-[#333] dark:hover:bg-[#333]">
                {theme === 'light' ?
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 m-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 m-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                }
              </button>
              <button onClick={handleLogout} className="w-20 block items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-md hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-0">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Account