import React, { useState } from 'react';
import { signUp, login } from '../authService';

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState(''); // State for displaying messages
  const [messageType, setMessageType] = useState(''); // State for message type (success/error)

  const handleSignUp = async () => {
    try {
      const user = await signUp(email, password, username);
      setMessage('Signed up successfully!'); // Set success message
      setMessageType('success'); // Set message type to success
      console.log('Signed up user:', user);
    } catch (error) {
      setMessage('Error signing up: ' + error.message); // Set error message
      setMessageType('error'); // Set message type to error
      console.error('Error signing up:', error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      setMessage('Logged in successfully!'); // Set success message
      setMessageType('success'); // Set message type to success
      console.log('Logged in user:', user);
    } catch (error) {
      setMessage('Error logging in: ' + error.message); // Set error message
      setMessageType('error'); // Set message type to error
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Authentication</h2>
        
        {/* Message Display */}
        {message && (
          <div 
            className={`mb-4 p-3 rounded-md ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" 
            className="w-full p-3 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            className="w-full text-gray-700 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            className="w-full text-gray-700 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSignUp}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
          <button 
            onClick={handleLogin}
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
