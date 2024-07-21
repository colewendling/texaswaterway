'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { client } from '@/sanity/lib/client';
import {
  createFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  removeFriend,
} from '@/app/actions/friendActions';
import {
  PENDING_FRIEND_REQUESTS_QUERY,
  SENT_FRIEND_REQUESTS_QUERY,
} from '@/sanity/lib/queries/friendRequestQueries';
import {
  SEARCH_USERS_QUERY,
  USER_FRIENDS_BY_USER_ID_QUERY,
} from '@/sanity/lib/queries/userQueries';
import { Check, Minus } from 'lucide-react';

const FriendManager = ({
  isOpen,
  onClose,
  userId,
  pendingCount,
  setPendingCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    { _id: string; username: string; image?: string; isFriend?: boolean }[]
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
      });
      setPendingRequests(requests);
      setSentRequests(sentRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  }, [userId]);

  const fetchFriends = useCallback(async () => {
    try {
      const result = await client.fetch(USER_FRIENDS_BY_USER_ID_QUERY, {
        userId,
      });
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

      // Fetch the current user's friends and sent requests
      const [currentUser, currentSentRequests] = await Promise.all([
        client.fetch('*[_type == "user" && _id == $userId][0]{friends}', {
          userId,
        }),
        client.fetch(SENT_FRIEND_REQUESTS_QUERY, { userId }),
      ]);

      // Filter out the current user and update results
      const updatedResults = results
        .filter((user) => user._id !== userId) // Exclude the current user
        .map((user) => ({
          ...user,
          isFriend: currentUser.friends?.some(
            (friend) => friend._ref === user._id,
          ),
          hasSentRequest: currentSentRequests.some(
            (request) => request.to._id === user._id,
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
      const result = await createFriendRequest(userId, toUserId);
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
    fromUserId: string,
    userId: string,
    requestId: string,
  ) => {
    try {
      const result = await acceptFriendRequest(fromUserId, userId, requestId);
      if (result.status === 'SUCCESS') {
        alert('Friend request accepted!');

        // Optimistic Update: Add the new friend to the friends list
        const newFriend = pendingRequests.find(
          (request) => request.from._id === fromUserId,
        );
        if (newFriend) {
          setFriends((prevFriends) => [
            ...prevFriends,
            {
              _id: newFriend.from._id,
              username: newFriend.from.username,
              image: newFriend.from.image,
            },
          ]);
        }

        fetchPendingRequests(); // Refresh pending requests
        fetchFriends(); // Refresh friends list to ensure consistency
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  // Reject a friend request
  const handleRejectRequest = async (requestId: string) => {
    try {
      const result = await deleteFriendRequest(requestId);
      if (result.status === 'SUCCESS') {
        alert('Friend request rejected!');
        fetchPendingRequests(); // Refresh pending requests
        handleSearch(); // Refresh search results
        setPendingCount(pendingCount - 1); // Update pending request count
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

        // Fetch updated friends list
        fetchFriends();

        // Optional: Optimistic Update
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend._id !== friendId),
        );
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="friend-manager">
        <div className="friend-manager-header-container">
          <h2 className="friend-manager-header">Manage Friends</h2>
        </div>

        {/* Search Users */}
        <div className="friend-manager-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or username..."
            className="friend-manager-search-input"
          />
          <button
            onClick={handleSearch}
            className="friend-manager-button-search"
          >
            Search
          </button>

          {/* Search Results Section */}
          {searchResults.length > 0 ? (
            <div className="friend-manager-search-results">
              <h3 className="friend-manager-label">Search Results</h3>
              {searchResults.map((user) => {
                // Check if the user is already in sentRequests
                const isRequestSent = sentRequests.some(
                  (request) => request.to._id === user._id,
                );

                return (
                  <div key={user._id} className="friend-manager-user-container">
                    <div className="friend-manager-user-item">
                      <a
                        href={`/user/${user.username}`}
                        className="friend-manager-user-avatar-container"
                      >
                        <img
                          src={user.image || '/fallback/default-avatar.png'}
                          alt={user.username}
                          className="friend-manager-user-avatar"
                        />
                      </a>
                      <span className="friend-manager-user-name">
                        {user.username}
                      </span>
                    </div>
                    {/* Add Send Friend Request Button */}
                    {!user.isFriend && !isRequestSent && (
                      <button
                        onClick={() => handleSendRequest(user._id)}
                        className="friend-manager-button-add"
                      >
                        + Add Friend
                      </button>
                    )}
                    {isRequestSent && (
                      <span className="friend-manager-results-sent">
                        Request Sent
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            hasSearched &&
            !isLoading &&
            searchTerm && (
              <p className="friend-manager-results-null">
                No users found matching "{searchTerm}".
              </p>
            )
          )}
        </div>

        {/* Pending Requests */}
        <div className="friend-manager-pending">
          <h3 className="friend-manager-label">Pending Friend Requests</h3>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div key={request._id} className="friend-manager-user-container">
                <div className="friend-manager-user-item">
                  <a
                    href={`/user/${request.from.username}`}
                    className="friend-manager-user-avatar-container"
                  >
                    <img
                      src={request.from.image || '/fallback/default-avatar.png'}
                      alt={request.from.username}
                      className="friend-manager-user-avatar"
                    />
                  </a>
                  <span className="friend-manager-user-name">
                    {request.from.username}
                  </span>
                </div>
                <div className="friend-manager-pending-buttons">
                  <button
                    onClick={() =>
                      handleAcceptRequest(request.from._id, userId, request._id)
                    }
                    className="friend-manager-button-accept"
                  >
                    <Check className="friend-manager-button-icon" />
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request._id)}
                    className="friend-manager-button-reject"
                  >
                    <Minus className="friend-manager-button-icon" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="friend-manager-results-null">No pending requests.</p>
          )}
        </div>
        {/* Sent Requests */}
        <div className="friend-manager-sent">
          <h3 className="friend-manager-label">Friend Requests Sent</h3>
          {sentRequests.length > 0 ? (
            sentRequests.map((request) => (
              <div key={request._id} className="friend-manager-user-container">
                <div className="friend-manager-user-item">
                  <a
                    href={`/user/${request.to.username}`}
                    className="friend-manager-user-avatar-container"
                  >
                    <img
                      src={request.to.image || '/fallback/default-avatar.png'}
                      alt={request.to.username}
                      className="friend-manager-user-avatar"
                    />
                  </a>
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
                  className="friend-manager-button-cancel"
                >
                  Cancel
                </button>
              </div>
            ))
          ) : (
            <p className="friend-manager-results-null">
              No friend requests sent.
            </p>
          )}
        </div>
        {/* Friends List Section */}
        <div className="friend-manager-friends">
          <h3 className="friend-manager-label">Your Friends</h3>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className="friend-manager-user-container">
                <div className="friend-manager-user-item">
                  <a
                    href={`/user/${friend.username}`}
                    className="friend-manager-user-avatar-container"
                  >
                    <img
                      src={friend.image || '/fallback/default-avatar.png'}
                      alt={friend.username}
                      className="friend-manager-user-avatar"
                    />
                  </a>
                  <span className="friend-manager-user-name">
                    {friend.username}
                  </span>
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
                  className="friend-manager-button-remove"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="friend-manager-results-null">
              Search above to add Friends.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FriendManager;
