import CreatePost from './CreatePost'
import { usePost } from '../context/PostContext'

const Modal = () => {
  const { showModal, setShowModal, currentPost } = usePost()

  return (
    <>
      <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
      <div id="popup-modal" tabIndex="-1" className="fixed flex mx-auto justify-center items-center top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto inset-0 h-modal h-full">
        <div className="relative w-full h-full max-w-xl h-auto">
          <div className='relative'>
            <button onClick={() => setShowModal(!showModal)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-hide="popup-modal">
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              <span className="sr-only">Close modal</span>
            </button>
            <CreatePost postID={currentPost.id} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal




