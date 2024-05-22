'use client';

import { useState } from 'react';
import Modal from './Modal';
import EventForm from './EventForm';
import { cn, formatDate } from '@/lib/utils';
import { EyeIcon, Edit } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Event } from '@/sanity/types';
import { Skeleton } from './ui/skeleton';
import { client } from '@/sanity/lib/client';
import { EVENT_PITCH_BY_EVENT_ID_QUERY } from '@/sanity/lib/queries/eventQueries';

export type EventCardType = Omit<Event, 'user'> & { user?: User };

const EventCard = ({
  post,
  editMode,
}: {
  post: EventCardType;
  editMode?: boolean;
}) => {
  const {
    _createdAt,
    views,
    user,
    title,
    category,
    _id,
    image,
    description,
    slug,
  } = post;

  const [isModalOpen, setModalOpen] = useState(false);
  const [pitch, setPitch] = useState<string | null>(null);

  const handleEditClick = async () => {
    setModalOpen(true);

    // Fetch the pitch for this event when the modal opens
    try {
      const data = await client.fetch(EVENT_PITCH_BY_EVENT_ID_QUERY, {
        id: _id,
      });
      setPitch(data?.pitch || ''); // Set the fetched pitch or an empty string
    } catch (error) {
      console.error('Failed to fetch pitch:', error);
    }
  };

  return (
    <li className="event-card group">
      {editMode && (
        <button
          onClick={handleEditClick}
          className="event-card-edit-button"
          aria-label="Edit"
        >
          <Edit className="event-card-edit-icon" />
        </button>
      )}
      <Link href={`/event/${slug?.current}`}>
        <div className="event-card-top">
          <p className="event-card_date">{formatDate(_createdAt)}</p>
          <div className="event-card-view">
            <EyeIcon className="event-card-view-icon" />
            <span className="event-card-text">{views}</span>
          </div>
        </div>
      </Link>
      <div className="event-card-header">
        <div className="event-card-header-container">
          <Link href={`/user/${user?.username}`}>
            <p className="event-card-username">{user?.name}</p>
          </Link>
          <Link href={`/event/${slug?.current}`}>
            <h3 className="event-card-title">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${user?.username}`}>
          <div className="event-card-avatar-container">
            <Image
              src={user?.image || ''}
              alt={user?.name || ''}
              fill
              sizes="48px"
              className="event-card-avatar"
            />
          </div>
        </Link>
      </div>

      <div className="event-card-middle">
        <Link href={`/event/${slug?.current}`}>
          <p className="event-card-description">{description}</p>
          <img src={image} alt="placeholder" className="event-card-img" />
        </Link>
      </div>

      <div className="event-card-bottom">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="event-card-category">{category}</p>
        </Link>
        <a
          className="event-card-button"
          href={`/event/${slug?.current}`}
        >
          <span className="event-card-button-text">Details</span>
        </a>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <EventForm existingEvent={{ ...post, pitch }} />
      </Modal>
    </li>
  );
};

export const EventCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn('skeleton', index)}>
        <Skeleton className="event-card-skeleton" />
      </li>
    ))}
  </>
);

export default EventCard;
