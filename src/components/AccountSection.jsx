import { useState, useEffect } from 'react';
import { getAuth, updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
const AccountSection = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async (user) => {
      if (user) {
        try {
          const response = await axios.get('http://localhost:5000/user-profile', {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });

          if (response.status === 200) {
            const { username, invitations } = response.data;
            setUsername(username || '');
            setInvitations(invitations || []);
            console.log(invitations);
          } else {
            console.error('Failed to fetch user profile');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error.message);
        }
      }
    };

    const authListener = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProfile(user);
      } else {
        setUsername('');
        setInvitations([]);
      }
    });

    return () => authListener();
  }, [auth, db]);

  const handleUpdateProfile = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: newUsername });
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, { username: newUsername });
        setUsername(newUsername);
        setNewUsername('');
      } catch (error) {
        console.error('Error updating profile:', error.message);
      }
    }
  };

  const handleUpdateEmail = async () => {
    if (auth.currentUser && currentPassword) {
      try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updateEmail(auth.currentUser, newEmail);
        setEmail(newEmail);
        setNewEmail('');
      } catch (error) {
        console.error('Error updating email:', error.message);
      }
    }
  };

  const handleAcceptInvitation = async (group) => {
    if (auth.currentUser) {
      try {
        const userId = auth.currentUser.uid;
        const invitationsQuery = query(
          collection(db, 'invitations'),
          where('invitee', '==', username),
          where('status', '==', 'pending')
        );
        const invitationSnapshot = await getDocs(invitationsQuery);

        if (!invitationSnapshot.empty) {
          const invitationDoc = invitationSnapshot.docs.find(doc => doc.data().group === group);
          if (invitationDoc) {
            const invitationData = invitationDoc.data();
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            await updateDoc(userDocRef, {
              groups: [...(userData.groups || []), group],
            });

            await updateDoc(invitationDoc.ref, {
              status: 'accepted'
            });

            setInvitations(prevInvitations => prevInvitations.filter(inv => inv.group !== group));
            alert('Invitation accepted and group added successfully!');
          } else {
            alert('No pending invitation found for this group.');
          }
        } else {
          alert('No pending invitation found.');
        }
      } catch (error) {
        console.error('Error accepting invitation:', error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg rounded-lg border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-white">Account Settings</h2>
      
      <div className="mb-6">
        <label htmlFor="username" className="block text-lg font-semibold text-gray-300 mb-2">Username</label>
        <p className="text-lg text-gray-200 mb-2">{username}</p>
        <input
          id="username"
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="New username"
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleUpdateProfile}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Username
        </button>
      </div>
      
      <div className="mb-6">
        <label htmlFor="email" className="block text-lg font-semibold text-gray-300 mb-2">Email</label>
        <p className="text-lg text-gray-200 mb-2">{email}</p>
        <input
          id="email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="New email"
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          id="password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className="w-full p-3 border border-gray-600 rounded-md mt-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleUpdateEmail}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Email
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-4 text-white">Invitations</h3>
        <ul>
          {invitations.length > 0 ? (
            invitations.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between mb-4 p-4 border border-gray-600 rounded-md bg-gray-800 shadow-sm">
                <span className="text-gray-300">{inv.group} - Invited by {inv.inviter}</span>
                <button
                  onClick={() => handleAcceptInvitation(inv.group)}
                  className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
                >
                  Accept
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No pending invitations.</p>
          )}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default AccountSection;
