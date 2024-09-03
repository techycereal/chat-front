import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import io from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [invitationUsername, setInvitationUsername] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const token = await user.getIdToken();
          const response = await axios.get('http://localhost:5000/my-groups', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { username, groups } = response.data;

          setUsername(username || 'Anonymous');
          setGroupList(groups || []);

          // Initialize Socket.IO connection
          socketRef.current = io('http://localhost:5000'); // Adjust the URL if needed

          // Event listener for when the connection is established
          socketRef.current.on('connect', () => {
            if (selectedGroup) {
              socketRef.current.emit('join', selectedGroup);
            }
          });

          // Event listener for incoming messages
          socketRef.current.on('message', (messageData) => {
            if (messageData.group === selectedGroup) {
              setMessages(prev => [...prev, messageData]);
            }
          });

          // Event listener for typing status
          socketRef.current.on('typing', (data) => {
            if (data.group === selectedGroup) {
              setTypingUsers(prev => [...new Set([...prev, data.user])]);
            }
          });

          // Cleanup function when component unmounts
          return () => {
            if (socketRef.current) {
              socketRef.current.disconnect();
            }
          };
        } catch (error) {
          console.error('Error fetching user profile:', error.message);
        }
      } else {
        window.location.pathname = '/login';
      }
    });

    return () => unsubscribeAuth();
  }, [selectedGroup]);

  const sendMessage = () => {
    if (input && selectedGroup) {
      const message = {
        group: selectedGroup,
        text: `${username}: ${input}`,
      };
      socketRef.current.emit('message', message);
      setMessages(prev => [...prev, message]); // Add the sent message to the state
      setInput('');
      setTypingUsers([]);
    }
  };

  const createGroup = async () => {
    if (groupName) {
      try {
        const token = await user.getIdToken();
        const response = await axios.post(
          'http://localhost:5000/create-group',
          { groupName, username },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response);
        setGroupList((prev) => [...prev, groupName]);
        setGroupName('');
      } catch (error) {
        console.error('Error creating group:', error.message);
      }
    }
  };

  const inviteToGroup = async (usernameToInvite, group) => {
    const token = await user.getIdToken();
    if (usernameToInvite && group) {
      try {
        const response = await axios.post(
          'http://localhost:5000/invite-to-group',
          { usernameToInvite, group, username },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          alert('User invited successfully!');
          setInvitationUsername('');
        } else {
          alert(response.data.message || 'Failed to invite user');
        }
      } catch (error) {
        console.error('Error inviting user:', error.message);
        alert('Error inviting user');
      }
    } else {
      alert('Username and group are required');
    }
  };

  const joinGroup = (group) => {
    setSelectedGroup(group);
    socketRef.current?.emit('join', group);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTyping = () => {
    if (selectedGroup && socketRef.current) {
      socketRef.current.emit('typing', {
        group: selectedGroup,
        user: username,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex">
      {/* Main Content */}
      <div className="flex-grow p-4">
        <button
          onClick={toggleSidebar}
          className={`fixed top-17 right-4 z-10 text-white p-1 ${!sidebarOpen && 'bg-gray-600'} rounded shadow-lg transition`}
        >
          {sidebarOpen ? '✖' : '☰'}
        </button>

        <div className="w-full">
          {selectedGroup ? (
            <>
              <div className="h-64 overflow-y-scroll bg-gray-800 p-4 rounded shadow-inner text-gray-200">
                {messages.map((msg, index) => (
                  <div key={index} className="mb-2">{msg.text}</div>
                ))}
                {typingUsers.length > 0 && (
                  <div className="text-gray-300 italic">Typing: {typingUsers.join(', ')}</div>
                )}
              </div>
              <div className="flex mt-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    handleTyping();
                  }}
                  className="flex-grow p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  placeholder="Type your message..."
                />
                <button
                  onClick={sendMessage}
                  className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-white">Select a group to start chatting.</p>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-18 right-0 h-full w-66 bg-gray-900 text-white transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">Groups</h2>
          <ul>
            {groupList.map((group, index) => (
              <li key={index} className="mt-2">
                <button
                  onClick={() => joinGroup(group)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {group}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Create Group</h3>
            <div className="flex">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="flex-grow p-2 border border-gray-600 rounded bg-gray-700 text-white"
                placeholder="Enter group name"
              />
              <button
                onClick={createGroup}
                className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
              >
                Create
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Invite User</h3>
            <div className="flex">
              <input
                type="text"
                value={invitationUsername}
                onChange={(e) => setInvitationUsername(e.target.value)}
                className="flex-grow p-2 border border-gray-600 rounded bg-gray-700 text-white"
                placeholder="Enter username"
              />
              <button
                onClick={() => inviteToGroup(invitationUsername, selectedGroup)}
                className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow transition"
              >
                Invite
              </button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
