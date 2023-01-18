import { AuthContextProvider } from './context/AuthContext'
import { PostContextProvider } from './context/PostContext'
import Account from './components/Account'
import ForgotPassword from './components/ForgotPassword'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import { Route, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Status from './components/Status'

function App() {
  return (
    <AuthContextProvider>
      <PostContextProvider>
        <Routes>
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route
            path='/account'
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route caseSensitive path='/p/:username' element={<Profile />} />
          <Route path='/p/:username/:postid' element={<Status />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/404' element={<NotFound />} />
          <Route path='*' element={<Signin />} />
        </Routes>
      </PostContextProvider>
    </AuthContextProvider>
  );
}

export default App
