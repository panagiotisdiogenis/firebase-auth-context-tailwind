import Account from './components/Account'
import Signin from './components/Signin'
import Signup from './components/Signup'
import { Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './components/ForgotPassword'

function App() {
  return (
    <AuthContextProvider>
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
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='*' element={<Signin />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App
