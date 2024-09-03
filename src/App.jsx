import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import Lottie from 'lottie-react';
import chatAnimation from './assets/chat.json'; // Adjust the path if needed
function App() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {/* Hero Section */}
      <section id="hero" className="text-white h-[50vh] flex items-center px-6 md:px-10">
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
        <h1 className="text-5xl font-bold mb-4">Chat Real-Time</h1>
        <p className="text-xl mb-6">Connecting you to the world wherever you are.</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
          Get Started
        </button>
      </div>
      <div className="hidden md:flex w-full md:w-1/2 justify-center items-center">
        <Lottie animationData={chatAnimation} loop={true} style={{ maxWidth: '300px', width: '100%' }} />
      </div>
    </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-10 flex justify-center">
  <div className="bg-white w-full md:w-4/5 lg:w-3/4 xl:w-1/2 p-8 rounded-lg shadow-lg">
    <h2 className="text-4xl font-bold mb-12 text-center">Explore Our Features</h2>
    <div className="flex flex-wrap justify-center gap-10">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full md:w-1/3">
        <div className="flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 10h16v2H4v-2zm0 4h16v2H4v-2z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-center">Instant Messaging</h3>
        <p className="text-lg text-center">
          Experience real-time messaging with smooth and reliable communication. Share texts, images, and videos instantly.
        </p>
      </div>
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full md:w-1/3">
        <div className="flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 11v10H7V11h14zm-1 1H8v8h12v-8zm-2 9H9v-1h9v1zm-3-5H9v-1h4v1z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-center">Create Groups</h3>
        <p className="text-lg text-center">
          Easily create and manage groups for different purposes, whether it’s for friends, family, or work teams.
        </p>
      </div>
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full md:w-1/3">
        <div className="flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 10h12v2H6v-2zm0 4h12v2H6v-2z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-center">Interactive Features</h3>
        <p className="text-lg text-center">
          Engage with interactive elements like typing indicators to enhance your communication experience.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gray-100 py-20 px-6 md:px-10">
        <h2 className="text-4xl font-bold mb-12 text-center">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">
              "Chat Real-Time has completely transformed the way my team communicates. The real-time messaging is seamless and reliable."
            </p>
            <h4 className="text-xl font-semibold">Alex Johnson</h4>
            <p className="text-sm text-gray-600">Team Lead, Tech Innovations</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">
              "The group creation feature is a game-changer for organizing family events and keeping everyone in the loop."
            </p>
            <h4 className="text-xl font-semibold">Maria Garcia</h4>
            <p className="text-sm text-gray-600">Freelancer & Blogger</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">
              "I love the interactive features, especially the typing indicators. It makes the communication experience so much richer."
            </p>
            <h4 className="text-xl font-semibold">John Smith</h4>
            <p className="text-sm text-gray-600">Software Developer</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-purple-900 text-white py-10 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Navigation Links */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:underline">Home</a></li>
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#testimonials" className="hover:underline">Testimonials</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">Email: <a href="mailto:support@chatrealtime.com" className="hover:underline">support@chatrealtime.com</a></p>
            <p>Phone: <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a></p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="text-white hover:text-gray-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12.1c0-5.5-4.5-10-10-10S2 6.6 2 12.1c0 5.1 4 9.3 9.2 9.9v-7h-2.8V12h2.8V9.6c0-2.7 1.6-4.1 3.8-4.1 1.1 0 2.2.1 2.2.1v2.4h-1.2c-1.2 0-1.6.7-1.6 1.4V12h2.8l-.4 2.1h-2.4v7c5.2-.6 9.2-4.8 9.2-9.9z"/>
              </svg>
            </a>
            <a href="https://twitter.com" className="text-white hover:text-gray-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3c-.8.4-1.6.7-2.5.8a4.7 4.7 0 0 0 2-2.6 9.4 9.4 0 0 1-3 1.2A4.7 4.7 0 0 0 16 2a4.8 4.8 0 0 0-4.8 4.8c0 .4.1.7.1 1a13.3 13.3 0 0 1-9.6-4.8 4.8 4.8 0 0 0 1.5 6.4 4.7 4.7 0 0 1-2.2-.6v.1a4.8 4.8 0 0 0 3.8 4.7 4.9 4.9 0 0 1-2.2.1 4.8 4.8 0 0 0 4.5 3.4 9.6 9.6 0 0 1-5.9 2.1c-.4 0-.8 0-1.2-.1A13.5 13.5 0 0 0 7.7 21a13.3 13.3 0 0 0 13.3-13.3c0-.2 0-.4-.1-.6A9.6 9.6 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" className="text-white hover:text-gray-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0H5C4.4 0 4 .4 4 1v22c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1zM8.7 20H6.3v-9h2.4v9zm-1.2-10.4c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4zm13.2 10.4h-2.4v-4.7c0-1.1-.4-1.8-1.2-1.8-.7 0-1.1.5-1.3 1-.1.2-.1.4-.1.6v4.9h-2.4v-5.4c0-1.4-.1-2.6-1.5-2.6-1.5 0-2.5 1.1-2.5 2.7v5.3H8.7v-9h2.4v1.3c.3-.5.8-1.3 1.7-1.3 1.2 0 2.1.8 2.1 2.4v1.2h.1v-.1c.8-1.1 2.1-1.7 3.4-1.7 2.3 0 4.1 1.8 4.1 4.6v5.3z"/>
              </svg>
            </a>
            <a href="https://instagram.com" className="text-white hover:text-gray-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.2c-3.6 0-4.1.02-5.6.08-1.5.06-2.8.35-3.8 1.4-1.1 1.1-1.4 2.4-1.4 3.8-.06 1.5-.08 2-.08 5.6s.02 4.1.08 5.6c.06 1.5.35 2.8 1.4 3.8 1.1 1.1 2.4 1.4 3.8 1.4 1.5.06 2 .08 5.6.08s4.1-.02 5.6-.08c1.5-.06 2.8-.35 3.8-1.4 1.1-1.1 1.4-2.4 1.4-3.8.06-1.5.08-2 .08-5.6s-.02-4.1-.08-5.6c-.06-1.5-.35-2.8-1.4-3.8-1.1-1.1-2.4-1.4-3.8-1.4-1.5-.06-2-.08-5.6-.08zm0 1.8c3.5 0 3.9.02 5.3.07 1.3.05 2.2.31 2.8.66.7.4 1.2 1.1 1.4 1.8.34.5.56 1.2.66 1.8.05 1.4.07 1.8.07 5.3s-.02 3.9-.07 5.3c-.1.6-.31 1.3-.66 1.8-.2.7-.7 1.4-1.4 1.8-.6.35-1.5.61-2.8.66-1.4.05-1.8.07-5.3.07s-3.9-.02-5.3-.07c-1.3-.05-2.2-.31-2.8-.66-.7-.4-1.2-1.1-1.4-1.8-.34-.5-.56-1.2-.66-1.8-.05-1.4-.07-1.8-.07-5.3s.02-3.9.07-5.3c.1-.6.31-1.3.66-1.8.2-.7.7-1.4 1.4-1.8.6-.35 1.5-.61 2.8-.66 1.4-.05 1.8-.07 5.3-.07zm0 3.5c-2.3 0-4.1 1.9-4.1 4.2 0 2.3 1.8 4.2 4.1 4.2 2.3 0 4.1-1.9 4.1-4.2 0-2.3-1.8-4.2-4.1-4.2zm0 6.6c-1.4 0-2.5-1.1-2.5-2.5 0-1.4 1.1-2.5 2.5-2.5 1.4 0 2.5 1.1 2.5 2.5 0 1.4-1.1 2.5-2.5 2.5zm4.2-7.3c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright Information */}
        <div className="text-center mt-6">
          <p>&copy; {new Date().getFullYear()} Chat Real-Time. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
