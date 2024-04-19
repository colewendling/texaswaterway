'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react'; // For the "Add Friend" icon
import FriendRequestModal from './FriendRequestModal';

const FriendList = ({ friends, userId }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="sub-heading">Friends</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="friend-button"
        >
          <UserPlus size={15} />
        </button>
      </div>
      <hr className="friend-divider" />

      {!friends || friends.length === 0 ? (
        <p className="">No friends added yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              href={`/user/${friend.username}`}
              className="friend-item flex flex-col items-center"
            >
              <img
                src={friend.image || '/default-avatar.png'}
                alt={friend.username}
                className="friend-photo w-16 h-16 rounded-full object-cover mb-2"
              />
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <FriendRequestModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default FriendList;
