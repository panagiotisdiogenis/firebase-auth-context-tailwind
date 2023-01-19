import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="flex items-center h-screen p-4 bg-gray-50 dark:bg-[#111]">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-5xl sm:text-7xl text-gray-400 dark:text-[#333]">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-lg font-semibold sm:text-2xl dark:text-white">Sorry, we couldn't find this page.</p>
          <p className="mt-4 mb-8 text-xs sm:text-base text-gray-400 dark:text-white">But dont worry, maybe you just need to sign in.</p>
          <Link to='/signin'>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
              Sign in
              <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound