import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Account = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <section className="bg-gray-50">
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen'>
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-xs">
          <div className="flex flex-col items-center p-10">
            <div className="relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 border border-gray-200 shadow-xs rounded-full">
              <span className="text-xl text-gray-600">{user.email[0].toUpperCase()}</span>
            </div>
            <div className="mt-8 font-bold text-md text-gray-900">{user.email}</div>
            <div className="mt-2 text-xs tracking-tight text-gray-500">ID: {user.uid}</div>
            <div className="flex mt-4 space-x-3 md:mt-6">
              <button onClick={handleLogout} className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Account