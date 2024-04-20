'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { client } from '@/sanity/lib/client';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from '@/lib/actions';
import {
  SEARCH_USERS_QUERY,
  PENDING_FRIEND_REQUESTS_QUERY,
  SENT_FRIEND_REQUESTS_QUERY,
  USER_FRIENDS_BY_ID_QUERY,
} from '@/sanity/lib/queries';

const FriendRequestModal = ({ isOpen, onClose, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    { _id: string; username: string; image?: string }[]
  >([]);
  const [pendingRequests, setPendingRequests] = useState<
    { _id: string; from: { _id: string; username: string; image?: string } }[]
  >([]);
  const [sentRequests, setSentRequests] = useState<
    { _id: string; to: { _id: string; username: string; image?: string } }[]
  >([]);
  const [friends, setFriends] = useState<
    { _id: string; username: string; image?: string }[]
  >([]);
  const [hasSearched, setHasSearched] = useState(false); // Tracks if search was triggered
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state

  // Fetch pending friend requests
  const fetchPendingRequests = useCallback(async () => {
    try {
      const requests = await client.fetch(PENDING_FRIEND_REQUESTS_QUERY, {
        userId,
      });
      const sentRequests = await client.fetch(SENT_FRIEND_REQUESTS_QUERY, {
        userId,
      })
      setPendingRequests(requests);
      setSentRequests(sentRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  }, [userId]);

  const fetchFriends = useCallback(async () => {
    try {
      const result = await client.fetch(USER_FRIENDS_BY_ID_QUERY, { userId });
      setFriends(result?.friends || []); // Ensure friends array is set correctly
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }, [userId]);

  // Fetch pending requests when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPendingRequests();
      fetchFriends();
    }
  }, [isOpen, fetchPendingRequests, fetchFriends]);

  // Search for users by name or username
  const handleSearch = async () => {
    setHasSearched(true); // Mark search as triggered
    setIsLoading(true); // Start loading
    try {
      const results = await client.fetch(SEARCH_USERS_QUERY, { searchTerm });
      // Fetch the current user's friends to check friendship status
      const currentUser = await client.fetch(
        '*[_type == "user" && _id == $userId][0]{friends}',
        { userId },
      );

      // Filter out the current user and update results
      const updatedResults = results
        .filter((user) => user._id !== userId) // Exclude the current user
        .map((user) => ({
          ...user,
          isFriend: currentUser.friends.some(
            (friend) => friend._ref === user._id,
          ),
        }));

      setSearchResults(updatedResults);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Send a friend request
  const handleSendRequest = async (toUserId: string) => {
    try {
      const result = await sendFriendRequest(userId, toUserId);
      if (result.status === 'SUCCESS') {
        alert('Friend request sent successfully!');
        setSearchResults([]);
        setSearchTerm('');
        fetchPendingRequests();
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Accept a friend request
  const handleAcceptRequest = async (
    userId: string,
    requestId: string,
    fromUserId: string,
  ) => {
    try {
      const result = await acceptFriendRequest(userId, requestId, fromUserId);
      if (result.status === 'SUCCESS') {
        alert('Friend request accepted!');
        fetchPendingRequests(); // Refresh pending requests
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  // Reject a friend request
  const handleRejectRequest = async (requestId: string) => {
    try {
      const result = await rejectFriendRequest(requestId);
      if (result.status === 'SUCCESS') {
        alert('Friend request rejected!');
        fetchPendingRequests(); // Refresh pending requests
        handleSearch(); // Refresh search results
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const result = await removeFriend(userId, friendId);
      if (result.status === 'SUCCESS') {
        alert('Friend removed successfully!');
        fetchPendingRequests(); // Refresh data
        handleSearch(); // Refresh search results
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Manage Friends</h2>

      {/* Search Users */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name or username..."
          className="w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
        >
          Search
        </button>

        {searchResults.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Search Results</h3>
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between mb-2"
              >
                <div className="flex items-center">
                  <img
                    src={user.image || '/default-avatar.png'}
                    alt={user.username}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <span>{user.username}</span>
                </div>
                {/* {user.isFriend ? (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to remove ${user.username} as a friend?`,
                        )
                      ) {
                        handleRemoveFriend(user._id);
                      }
                    }}
                    className="bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Remove Friend
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    className="bg-green-500 text-white py-1 px-3 rounded"
                  >
                    Add Friend
                  </button>
                )} */}
              </div>
            ))}
          </div>
        ) : (
          hasSearched &&
          !isLoading && // Ensure loading has finished
          searchTerm && (
            <p className="text-gray-500 text-center mt-4">
              No users found matching "{searchTerm}".
            </p>
          )
        )}
      </div>

      {/* Pending Requests */}
      <div>
        <h3 className="font-semibold mb-4">Pending Friend Requests</h3>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                <img
                  src={request.from.image || '/default-avatar.png'}
                  alt={request.from.username}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span>{request.from.username}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleAcceptRequest(userId, request._id, request.from._id)
                  }
                  className="bg-blue-500 text-white py-1 px-3 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectRequest(request._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No pending requests.</p>
        )}
      </div>
      {/* Sent Requests */}
      <div className="my-4">
        <h3 className="font-semibold mb-4">Friend Requests Sent</h3>
        {sentRequests.length > 0 ? (
          sentRequests.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                <img
                  src={request.to.image || '/default-avatar.png'}
                  alt={request.to.username}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span>{request.to.username}</span>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to cancel the friend request to ${request.to.username}?`,
                    )
                  ) {
                    handleRejectRequest(request._id); // Cancel the request
                  }
                }}
                className="bg-red-500 text-white py-1 px-3 rounded"
              >
                Cancel Request
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No friend requests sent.</p>
        )}
      </div>
      {/* Friends List Section */}
      <div className="my-4">
        <h3 className="font-semibold mb-4">Your Friends</h3>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                <img
                  src={friend.image || '/default-avatar.png'}
                  alt={friend.username}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span>{friend.username}</span>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to remove ${friend.username} as a friend?`,
                    )
                  ) {
                    handleRemoveFriend(friend._id);
                  }
                }}
                className="bg-red-500 text-white py-1 px-3 rounded"
              >
                Remove Friend
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">You have no friends.</p>
        )}
      </div>
    </Modal>
  );
};

export default FriendRequestModal;
