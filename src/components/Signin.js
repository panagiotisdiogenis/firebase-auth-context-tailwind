import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { signin, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(`/p/${user.username}`)
    }
    setLoading(false)
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signin(email, password)
    } catch (e) {
      console.log(e.message)
      setError('Sorry, incorrect username or password.')
      setLoading(false)
    }
  }

  if (loading && user) return null

  return (
    <section className="bg-gray-50 dark:bg-[#111]">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
        <div className="w-full bg-white rounded-xl border border-[#dbdbdb] md:mt-0 sm:max-w-md xl:p-0 dark:bg-black dark:border-[#333]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign In
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-none focus:ring-transparent focus:ring-[0px] dark:bg-[#111] dark:focus:bg-[#111] dark:border-[#333] dark:text-white" placeholder="name@company.com" required="" />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-none focus:ring-transparent focus:ring-[0px] dark:bg-[#111] dark:focus:bg-[#111] dark:border-[#333] dark:text-white" required="" />
              </div>
              <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-0">
                {loading && !user ?
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>
                  : 'Sign in'}
              </button>
              {error && <div className="flex justify-center p-[10px] mb-4 text-sm text-rose-500 bg-white dark:bg-black rounded-lg" role="alert">
                <div>{error}</div>
              </div>}
              <p className="text-sm text-center text-gray-500">
                Don’t have an account yet? <Link to='/signup' className='font-medium text-blue-600 hover:underline'>Sign up</Link>
              </p>
              <p className="text-center">
                <Link to='/forgot-password' className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signin
