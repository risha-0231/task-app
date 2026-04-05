import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard    from './pages/Dashboard';
import BoardPage    from './pages/BoardPage';

// Wrapper that redirects to /login if not logged in
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/boards"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/boards/:id"
            element={<PrivateRoute><BoardPage /></PrivateRoute>}
          />
          <Route path="*" element={<Navigate to="/boards" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;