import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')
      await signup(email, password, username)
      navigate('/account')
    } catch (e) {
      console.log(e.message)
      setError('Invalid email or password.')
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-[#111]">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
        <div className="w-full bg-white rounded-xl border border-[#dbdbdb] md:mt-0 sm:max-w-md xl:p-0 dark:bg-black dark:border-[#333]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign Up
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input onChange={(e) => setUsername(e.target.value)} type="username" name="username" id="username" maxLength="15" placeholder="username@123" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-none focus:ring-transparent focus:ring-[0px] dark:bg-[#111] dark:focus:bg-[#111] dark:border-[#333] dark:text-white" required="" />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-none focus:ring-transparent focus:ring-[0px] dark:bg-[#111] dark:focus:bg-[#111] dark:border-[#333] dark:text-white" placeholder="name@company.com" required="" />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-none focus:ring-transparent focus:ring-[0px] dark:bg-[#111] dark:focus:bg-[#111] dark:border-[#333] dark:text-white" required="" />
              </div>
              <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-0">Create an account</button>
              {error && <div className="flex justify-center p-[10px] mb-4 text-sm text-rose-500 bg-white dark:bg-black rounded-lg" role="alert">
                <div>{error}</div>
              </div>}
              <p className="text-sm text-center font-light text-gray-500">
                Have an account? <Link to='/signin' className='font-medium text-blue-600 hover:underline'>Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup
