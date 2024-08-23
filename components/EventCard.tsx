'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import EventForm from './EventForm';
import { cn, formatDate, getLakeNameById } from '@/lib/utils';
import { EyeIcon, Edit, ThumbsUp } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Event } from '@/sanity/types';
import { Skeleton } from './ui/skeleton';
import { client } from '@/sanity/lib/client';
import { EVENT_PITCH_BY_EVENT_ID_QUERY } from '@/sanity/lib/queries/eventQueries';

export type EventCardType = Omit<Event, 'user'> & { user?: User };

interface EventCardProps {
  post: EventCardType;
  editMode?: boolean;
  featuredEventIds?: string[];
}

const EventCard = ({
  post,
  editMode,
  featuredEventIds = [],
}: EventCardProps) => {
  const {
    _createdAt,
    views,
    user,
    title,
    category,
    lake,
    _id,
    image,
    description,
    slug,
  } = post;

  const [isModalOpen, setModalOpen] = useState(false);
  const [pitch, setPitch] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);

  // Determine if this event is featured
  useEffect(() => {
    if (featuredEventIds.includes(_id)) {
      setIsFeatured(true);
    } else {
      setIsFeatured(false);
    }
  }, [_id, featuredEventIds]);

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

  const getCategoryColor = (category: string | undefined): string => {
    if (!category) return 'black-500'; // Return fallback if category is missing

    const key = category.trim().toLowerCase().replace(/\s+/g, ''); // Normalize key

    const categoryColors = {
      boating: 'bg-blue-500',
      boyscouts: 'bg-purple-500',
      cleanup: 'bg-green-500',
      community: 'bg-purple-500',
      default: 'bg-gray-300',
      fishing: 'bg-blue-500',
      hiking: 'bg-pink-500',
      kayaking: 'bg-purple-500',
      marketplace: 'bg-purple-500',
      party: 'bg-pink-500',
      wildlife: 'bg-green-500',
    };

    return categoryColors[key] || 'bg-black-500';
  };

  return (
    <li
      className={`group ${isFeatured ? 'event-card-featured' : 'event-card-default'}`}
    >
      {editMode && (
        <button
          onClick={handleEditClick}
          className="event-card-edit-button"
          aria-label="Edit"
        >
          <Edit className="event-card-edit-icon" />
        </button>
      )}
      {isFeatured && (
        <Link
          href={`/event/${slug?.current}`}
          className="event-card-featured-badge"
          data-tooltip="Featured Event"
        >
          <ThumbsUp className="event-card-featured-badge-icon" />
        </Link>
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
            <p className="event-card-name">{user?.name}</p>
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
      <Link
        href={`/?query=${lake?.toLowerCase()}`}
        className="flex items-center gap-2"
      >
        <p className={`event-card-lake`}>{lake ? getLakeNameById(lake) : ''}</p>
      </Link>
      <Link href={`/event/${slug?.current}`}>
        <p className="event-card-description">{description}</p>
        <img src={image} alt="placeholder" className="event-card-image" />
      </Link>
      <div className="event-card-bottom">
        <div>
          <Link
            href={`/?query=${category?.toLowerCase()}`}
            className="flex items-center gap-2"
          >
            <span
              className={`w-3 h-3 rounded-full ${getCategoryColor(category || '')}`}
              aria-hidden="true"
            ></span>
            <p className={`event-card-category`}>{category}</p>
          </Link>
        </div>
        <a className="event-card-button" href={`/event/${slug?.current}`}>
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
