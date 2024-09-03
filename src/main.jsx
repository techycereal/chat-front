import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import App from './App.jsx';
import './index.css';
import AuthComponent from './components/AuthForm.jsx';
import Chat from './components/Chat.jsx';
import AccountSection from './components/AccountSection.jsx';
import { logout } from './authService.js';
const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [auth]);

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 flex justify-between items-center shadow-lg">
        <p 
          onClick={() => window.location.pathname = '/'}
          className="cursor-pointer hover:bg-gray-800 p-2 rounded transition"
        >
          Home
        </p>
        <div className="space-x-4 flex row">
          <p 
            onClick={() => window.location.pathname = '/chat'}
            className="cursor-pointer hover:bg-gray-800 p-2 rounded transition"
          >
            Chat
          </p>
          {isLoggedIn ? (
            <>
            <p 
              onClick={() => window.location.pathname = '/account'}
              className="cursor-pointer hover:bg-gray-800 p-2 rounded transition"
            >
              Account
            </p>
            <p 
              onClick={handleLogout}
              className="cursor-pointer hover:bg-gray-800 p-2 rounded transition"
            >
              Logout
            </p>
            </>
          ) : (
            <p 
              onClick={() => window.location.pathname = '/login'}
              className="cursor-pointer hover:bg-gray-800 p-2 rounded transition"
            >
              Login
            </p>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<AuthComponent />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/account" element={<AccountSection />} />
      </Routes>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Main />
    </Router>
  </StrictMode>,
);
