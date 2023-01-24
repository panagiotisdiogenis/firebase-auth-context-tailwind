import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'

const Nav = () => {
  const { user } = useAuth()
  const { showModal, setShowModal } = usePost()
  const navigate = useNavigate()

  const handleCreatePost = () => {
    if (!user) {
      navigate('/siginin')
    } else {
      setShowModal(!showModal)
    }
  }

  return (
    <nav className="bg-white px-4 py-4 sm:py-2 fixed w-full z-20 top-0 left-0 border-b border-[#dbdbdb] dark:border-[#333] dark:bg-[#111]">
      <div className="container flex flex-wrap items-center justify-between mx-auto max-w-xl">
        <Link to={user ? `/p/${user.username}` : '/'} className="sm:hidden flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#FA1A7F]">
            <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
          </svg>
        </Link>
        <ul className="hidden sm:flex hover:bg-red flex flex-col p-4 pl-0 mt-4 border border-gray-100 rounded-lg bg-white md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-[#111] md:dark:bg-[#111] dark:border-gray-700">
          <Link to={user ? `/p/${user.username}` : '/'}>
            <button className="block py-2 pl-3 pr-4 text-black rounded md:bg-transparent md:p-0 dark:text-white" aria-current="page">Home</button>
          </Link>
          <Link to='/account'>
            <button className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Account</button>
          </Link>
        </ul>
        <div className="flex md:order-2">
          <Link to='/account' className="flex items-center sm:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-600 dark:bg-[#111] dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
          <button onClick={handleCreatePost} type="button" className="hidden sm:flex text-black bg-white hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-2 text-center mr-3 md:mr-0 border dark:bg-black dark:border-[#333] dark:text-white dark:hover:bg-[#111]">Create</button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
        </div>
      </div>
    </nav>
  )
}

export default Nav