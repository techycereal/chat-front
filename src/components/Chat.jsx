import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

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
  const ws = useRef(null);
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUsername(userDoc.data().username || 'Anonymous');
          } else {
            console.error('No such user document!');
          }

          const groupsQuery = doc(db, 'users', user.uid);
          const groupsSnapshot = await getDoc(groupsQuery);
          if (groupsSnapshot.exists()) {
            const userGroups = groupsSnapshot.data().groups || [];
            setGroupList(userGroups);
          }

          // Initialize WebSocket connection
          ws.current = new WebSocket('ws://localhost:5000');

          ws.current.onopen = () => {
            console.log('WebSocket connection established');
            if (selectedGroup) {
              ws.current.send(JSON.stringify({ action: 'join', group: selectedGroup }));
            }
          };

          ws.current.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            if (messageData.group === selectedGroup) {
              if (messageData.action === 'typing') {
                setTypingUsers((prev) => [...new Set([...prev, messageData.user])]);
              } else {
                setMessages((prev) => [...prev, messageData]);
                setTypingUsers((prev) => prev.filter(user => user !== messageData.user));
              }
            }
          };

          return () => {
            if (ws.current) {
              ws.current.close();
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
      ws.current.send(JSON.stringify(message));
      setInput('');
      setTypingUsers([]); // Clear typing indicator after sending a message
    }
  };

  const createGroup = async () => {
    if (groupName) {
      try {
        const groupRef = doc(db, 'groups', groupName);
        await setDoc(groupRef, { members: [username], creator: username });
        alert('Group created successfully!');
        const userRef = doc(db, 'users', getAuth().currentUser.uid);
        await updateDoc(userRef, { groups: arrayUnion(groupName) });
        setGroupList((prev) => [...prev, groupName]);
        setGroupName('');
      } catch (error) {
        console.error('Error creating group:', error.message);
      }
    }
  };

  const inviteToGroup = async (usernameToInvite, group) => {
    if (usernameToInvite && group) {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', usernameToInvite));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const invitationId = `${usernameToInvite}-${username}`;
          const invitationRef = doc(db, 'invitations', invitationId);

          const invitationSnapshot = await getDoc(invitationRef);

          if (!invitationSnapshot.exists()) {
            await setDoc(invitationRef, {
              group,
              invitee: usernameToInvite,
              inviter: username,
              status: 'pending',
            });
            alert('User invited successfully!');
            setInvitationUsername('');
          } else {
            alert('User not found!');
          }
        }
      } catch (error) {
        console.error('Error inviting user:', error.message);
      }
    }
  };

  const joinGroup = (group) => {
    setSelectedGroup(group);
    if (ws.current) {
      ws.current.send(JSON.stringify({ action: 'join', group }));
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTyping = () => {
    if (selectedGroup && ws.current) {
      ws.current.send(JSON.stringify({ action: 'typing', group: selectedGroup, user: username }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {/* Main Content */}
      <div className="flex-grow p-4">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-18 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded shadow-lg transition"
        >
          {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>

        {/* Chat Area */}
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
                    handleTyping(); // Notify others that the user is typing
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
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">Groups</h2>
          <ul>
            {groupList.map((group, index) => (
              <li key={index} className="mt-2">
                <button
                  onClick={() => joinGroup(group)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {group}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Create Group</h3>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
              placeholder="Enter group name"
            />
            <button
              onClick={createGroup}
              className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
            >
              Create
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Invite User</h3>
            <input
              type="text"
              value={invitationUsername}
              onChange={(e) => setInvitationUsername(e.target.value)}
              className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
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
  );
};

export default Chat;
