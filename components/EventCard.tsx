'use client';

import { useState } from 'react';
import Modal from './Modal';
import EventForm from './EventForm';
import { cn, formatDate } from '@/lib/utils';
import { EyeIcon, Edit } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
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
    slug
  } = post;

  const [isModalOpen, setModalOpen] = useState(false);
  const [pitch, setPitch] = useState<string | null>(null);

  const handleEditClick = async () => {
    setModalOpen(true);

    // Fetch the pitch for this event when the modal opens
    try {
      const data = await client.fetch(EVENT_PITCH_BY_EVENT_ID_QUERY, { id: _id });
      setPitch(data?.pitch || ''); // Set the fetched pitch or an empty string
    } catch (error) {
      console.error('Failed to fetch pitch:', error);
    }
  };

  return (
    <li className="event-card group relative">
      {editMode && (
        <button
          onClick={handleEditClick}
          className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center bg-white hover:bg-primary border-2 border-black rounded-full shadow-md"
          aria-label="Edit"
        >
          <Edit className="w-5 h-5 text-black" />
        </button>
      )}
      <div className="flex-between">
        <p className="event-card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${user?.username}`}>
            <p className="text-16-medium line-clamp-1 hover:text-primary">
              {user?.name}
            </p>
          </Link>
          <Link href={`/event/${slug?.current}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${user?.username}`}>
          <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md">
            <Image
              src={user?.image || ''}
              alt={user?.name || ''}
              fill
              sizes="48px"
              className="event-card_avatar"
            />
          </div>
        </Link>
      </div>

      <Link href={`/event/${slug?.current}`}>
        <p className="event-card_desc">{description}</p>
        <img src={image} alt="placeholder" className="event-card_img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium hover:text-primary">{category}</p>
        </Link>
        <Button className="event-card_btn" asChild>
          <Link href={`/event/${slug?.current}`}>Details</Link>
        </Button>
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
        <Skeleton className="event-card_skeleton" />
      </li>
    ))}
  </>
);

export default EventCard;
