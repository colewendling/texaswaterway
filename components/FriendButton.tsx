'use client';

import React from 'react';
import { UserPlus, Ban } from 'lucide-react';
import {
  createFriendRequest,
  deleteFriendRequest,
  removeFriend,
} from '@/app/actions/friendActions';

const FriendButton = ({
  userId,
  sessionId,
  isOwnProfile,
  isFriend,
  pendingCount,
  hasPendingRequest,
  requestId,
  setHasPendingRequest,
  setRequestId,
  setModalOpen,
}: {
  userId: string;
  sessionId: string;
  isOwnProfile: boolean;
  isFriend: boolean;
  pendingCount: number;
  hasPendingRequest: boolean;
  requestId: string;
  setHasPendingRequest: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestId: React.Dispatch<React.SetStateAction<string>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleSendRequest = async (fromUserId: string, toUserId: string) => {
    try {
      const result = await createFriendRequest(fromUserId, toUserId);
      if (result.status === 'SUCCESS') {
        alert('Friend request sent successfully!');
        setHasPendingRequest(true);
        if (result.friendRequest) {
          setRequestId(result.friendRequest._id);
        }
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!requestId) {
      console.error('No requestId found for cancellation.');
      return;
    }

    try {
      const result = await deleteFriendRequest(requestId); // Use requestId
      if (result.status === 'SUCCESS') {
        alert('Friend request canceled.');
        setHasPendingRequest(false); // Update state optimistically
      }
    } catch (error) {
      console.error('Error canceling friend request:', error);
    }
  };

  const handleRemoveFriend = async (sessionId: string, userId: string) => {
    try {
      const result = await removeFriend(sessionId, userId);
      if (result.status === 'SUCCESS') {
        alert('Friend removed successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <>
      {isOwnProfile && (
        <button
          onClick={() => {
            setModalOpen(true);
          }}
          className={`friend-button ${pendingCount > 0 ? 'friend-button-notify' : 'friend-button-default'}`}
        >
          <UserPlus className="friend-button-icon" />
          {pendingCount > 0 && (
            <>
              <span className="friend-button-notification-circle-text">
                {pendingCount}
              </span>
              <span className="friend-button-notification-circle-bg" />
              <span className="friend-button-notification-circle" />
            </>
          )}
        </button>
      )}
      {!isOwnProfile && !isFriend && !hasPendingRequest && (
        <button
          onClick={() => {
            handleSendRequest(sessionId, userId);
          }}
          className="friend-button-add"
        >
          + Add Friend
        </button>
      )}
      {!isOwnProfile && !isFriend && hasPendingRequest && (
        <button
          onClick={() => handleCancelRequest(requestId)}
          className="friend-button-cancel"
        >
          <span>
            <Ban size={15} />
          </span>
          Cancel Request
        </button>
      )}
      {!isOwnProfile && isFriend && (
        <button
          onClick={() => handleRemoveFriend(sessionId, userId)}
          className="friend-button-remove"
        >
          - Remove as Friend
        </button>
      )}
    </>
  );
};

export default FriendButton;
