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
import { Check, Minus, Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoadingId, setButtonLoadingId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<
    'accept' | 'reject' | null
  >(null);

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
      setIsLoading(false);
    }
  };

  // Send a friend request
  const handleSendRequest = async (toUserId: string) => {
    setButtonLoadingId(toUserId);
    try {
      const result = await createFriendRequest(userId, toUserId);
      if (result.status === 'SUCCESS') {
        toast({
          title: 'Success',
          description: 'Friend request sent successfully!',
        });
        setSearchResults([]);
        setSearchTerm('');
        fetchPendingRequests();
      } else {
        toast({
          title: 'Error',
          description: 'Error sending friend request.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setButtonLoadingId(null);
    }
  };

  // Accept a friend request
  const handleAcceptRequest = async (
    fromUserId: string,
    userId: string,
    requestId: string,
  ) => {
    setIsLoading(true);
    setButtonLoadingId(requestId);
    setLoadingAction('accept');
    try {
      const result = await acceptFriendRequest(fromUserId, userId, requestId);
      if (result.status === 'SUCCESS') {
        toast({
          title: 'Success',
          description: 'Friend request accepted!',
        });
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

        await fetchPendingRequests(); // Refresh pending requests
        await fetchFriends(); // Refresh friends list to ensure consistency
        await handleSearch(); // Refresh search results
        setPendingCount((prevCount) => prevCount - 1);
      } else {
        toast({
          title: 'Error',
          description: 'Error accepting friend request.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setIsLoading(false);
      setButtonLoadingId(null);
      setLoadingAction(null); // Reset the action
    }
  };

  // Reject a friend request
  const handleRejectRequest = async (
    requestId: string,
    isIncoming: boolean,
  ) => {
    setButtonLoadingId(requestId);
    setLoadingAction('reject'); // Indicate the action is 'reject'
    setIsLoading(true);
    try {
      const result = await deleteFriendRequest(requestId);
      if (result.status === 'SUCCESS') {
        toast({
          title: 'Success',
          description: isIncoming
            ? 'Friend request rejected!'
            : 'Outgoing friend request canceled!',
        });
        await fetchPendingRequests(); // Refresh pending requests
        await handleSearch(); // Refresh search results

        if (isIncoming) {
          setPendingCount(pendingCount - 1); // Update pending request count
        }
      } else {
        toast({
          title: 'Error',
          description: isIncoming
            ? 'Error rejecting friend request.'
            : 'Error canceling outgoing request.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(
        `Error ${isIncoming ? 'rejecting' : 'canceling'} friend request:`,
        error,
      );
    } finally {
      setIsLoading(false);
      setButtonLoadingId(null);
      setLoadingAction(null); // Reset the action
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    setButtonLoadingId(friendId);
    try {
      const result = await removeFriend(userId, friendId);
      if (result.status === 'SUCCESS') {
        toast({
          title: 'Success',
          description: 'Friend removed successfully!',
        });

        // Fetch updated friends list
        fetchFriends();
        // Optional: Optimistic Update
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend._id !== friendId),
        );
      } else {
        toast({
          title: 'Error',
          description: 'Error removing friend.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    } finally {
      setButtonLoadingId(null);
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
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
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
                const isRequestReceived = pendingRequests.some(
                  (request) => request.from._id === user._id,
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
                    {!user.isFriend && !isRequestReceived && !isRequestSent && (
                      <button
                        onClick={() => handleSendRequest(user._id)}
                        className="friend-manager-button-add"
                        disabled={buttonLoadingId === user._id}
                      >
                        {buttonLoadingId === user._id
                          ? 'Sending...'
                          : '+ Add Friend'}
                      </button>
                    )}
                    {isRequestSent && (
                      <span className="friend-manager-results-sent">
                        Request Sent
                      </span>
                    )}
                    {user.isFriend && (
                      <span className="friend-manager-results-sent">
                        Friends
                      </span>
                    )}
                    {!user.isFriend && isRequestReceived && (
                      <span className="friend-manager-results-sent">
                        Pending
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
                    disabled={buttonLoadingId === request._id || isLoading}
                  >
                    {buttonLoadingId === request._id &&
                    loadingAction === 'accept' ? (
                      <Loader className="loader" />
                    ) : (
                      <Check className="friend-manager-button-icon" />
                    )}
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request._id, true)}
                    className="friend-manager-button-reject"
                    disabled={buttonLoadingId === request._id || isLoading}
                  >
                    {buttonLoadingId === request._id &&
                    loadingAction === 'reject' ? (
                      <Loader className="loader" />
                    ) : (
                      <Minus className="friend-manager-button-icon" />
                    )}
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
                      handleRejectRequest(request._id, false);
                    }
                  }}
                  className="friend-manager-button-cancel"
                  disabled={buttonLoadingId === request._id}
                >
                  {buttonLoadingId === request._id ? (
                    <Loader className="loader" />
                  ) : (
                    'Cancel'
                  )}
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
                  disabled={buttonLoadingId === friend._id}
                >
                  {buttonLoadingId === friend._id ? (
                    <Loader className="loader" />
                  ) : (
                    'Remove'
                  )}
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
