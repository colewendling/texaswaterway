'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FriendButton from './FriendButton';
import FriendManager from './FriendManager';
import {
  PENDING_FRIEND_REQUESTS_QUERY,
  SENT_FRIEND_REQUESTS_QUERY,
} from '@/sanity/lib/queries/friendRequestQueries';
import { client } from '@/sanity/lib/client';

const FriendList = ({
  friends,
  userId,
  sessionId,
  isOwnProfile,
  isFriend,
}: {
  friends: any[];
  userId: string;
  sessionId: string;
  isOwnProfile: boolean;
  isFriend: boolean;
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [requestId, setRequestId] = useState(''); // Store requestId

  // Fetch pending friend requests count if on own profile
  useEffect(() => {
    if (isOwnProfile) {
      const fetchPendingCount = async () => {
        try {
          const requests = await client.fetch(PENDING_FRIEND_REQUESTS_QUERY, {
            userId,
          });
          setPendingCount(requests.length);
        } catch (error) {
          console.error('Error fetching pending requests:', error);
        }
      };

      fetchPendingCount();
    }
  }, [isOwnProfile, userId]);

  // Check if there is a pending request from session user to profile user
  useEffect(() => {
    if (!isOwnProfile) {
      const fetchSentRequests = async () => {
        try {
          const sentRequests = await client.fetch(SENT_FRIEND_REQUESTS_QUERY, {
            userId: sessionId,
          });
          const request = sentRequests.find(
            (req: { to: { _id: string } }) => req.to._id === userId,
          );

          setHasPendingRequest(!!request);
          setRequestId(request?._id || ''); // Set the requestId
        } catch (error) {
          console.error('Error fetching sent friend requests:', error);
        }
      };

      fetchSentRequests();
    }
  }, [isOwnProfile, sessionId, userId]);

  return (
    <div className="friend-list">
      <div className="friend-list-top">
        <h1 className="sub-heading">Friends</h1>
        {sessionId && (
          <FriendButton
            userId={userId}
            sessionId={sessionId}
            isOwnProfile={isOwnProfile}
            isFriend={isFriend}
            pendingCount={pendingCount}
            setModalOpen={setModalOpen}
            hasPendingRequest={hasPendingRequest}
            setHasPendingRequest={setHasPendingRequest}
            setRequestId={setRequestId}
            requestId={requestId}
          />
        )}
      </div>
      <hr className="friend-list-divider" />

      {!friends || friends.length === 0 ? (
        <p className="">No friends added yet.</p>
      ) : (
        <div className="friend-list-grid">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              href={`/user/${friend.username}`}
              className="friend-list-item"
            >
              <img
                src={friend.image || '/fallback/default-avatar.png'}
                alt={friend.username}
                className="friend-list-avatar"
              />
            </Link>
          ))}
        </div>
      )}

      {isOwnProfile && (
        <FriendManager
          isOpen={isModalOpen}
          pendingCount={pendingCount}
          setPendingCount={setPendingCount}
          onClose={() => setModalOpen(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default FriendList;
