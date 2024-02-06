import { formatDate } from '@/lib/utils';
import { EyeIcon } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Author, Event } from '@/sanity/types';

export type EventTypeCard = Omit<Event, "author"> & { author?: Author};

const EventCard = ({ post }: { post: EventTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
  } = post;
  return (
    <li className="event-card group">
      <div className="flex-between">
        <p className="event-card-date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/event/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user${author?._id}`}>
          <Image
            src="https://placehold.co/48x48"
            alt="placeholder"
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/event/${_id}`}>
        <p className="event-card-desc">{description}</p>
        <img src={image} alt="placeholder" className="event-card-img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="event-card_btn" asChild>
          <Link href={`/event/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default EventCard;
