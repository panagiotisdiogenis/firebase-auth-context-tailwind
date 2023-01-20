import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Nav = () => {
  const { user } = useAuth()

  return (
    <nav className="bg-white px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-[#333] dark:bg-[#111]">
      <div className="container flex flex-wrap items-center justify-between mx-auto max-w-xl">
        <Link to={`/p/${user.username}`} className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-[#FA1A7F]">
            <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
          </svg>
          {/*<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">FireFive</span>*/}
        </Link>
        <div className="flex md:order-2">
          {/* 
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none rounded-full text-xs px-5 py-2 text-center mr-3 md:mr-0 dark:bg-black dark:border-[#333] dark:border dark:hover:bg-[#111]">Create</button>
          <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
          */}
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
        </div>
      </div>
    </nav>
  )
}

export default Nav