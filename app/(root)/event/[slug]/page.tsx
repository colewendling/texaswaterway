import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries/eventQueries';
import { PLAYLIST_BY_SLUG_QUERY } from '@/sanity/lib/queries/playlistQueries';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import markdownit from 'markdown-it';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import EventCard, { EventCardType } from '@/components/EventCard';

const md = markdownit();

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  const [post, { select: editorPosts }] = await Promise.all([
    client.fetch(EVENT_BY_SLUG_QUERY, { slug }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'featured-events' }),
  ]);

  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || '');

  return (
    <div className="event-page">
      <section className="event-hero-container">
        <p className="event-tag">{formatDate(post?._createdAt)}</p>
        <h1 className="event-heading">{post.title}</h1>
        <p className="event-subheading">{post.description}</p>
        <img
          src="/art/events-left.png"
          alt="Events Left"
          className="event-hero-art-left"
        />
        <img
          src="/art/events-right.png"
          alt="Events Left"
          className="event-hero-art-right"
        />
      </section>
      <section className="section_container">
        <img src={post.image} alt="thumbnail" className="event-header-image" />
        <div className="event-container">
          <div className="event-top">
            <Link
              href={`/user/${post.user?.username}`}
              className="event-user-container"
            >
              <img
                src={post.user.image}
                alt="avatar"
                className="event-user-avatar"
              />
              <div>
                <p className="text-20-medium">{post.user.name}</p>
                <p className="text-16-medium">@{post.user.username}</p>
              </div>
            </Link>
            <p className="event-category">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Event Details</h3>
          {parsedContent ? (
            <article
              className="event-pitch"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-results">No details provided for this event.</p>
          )}
        </div>
        <hr className="event-divider" />
        {editorPosts?.length > 0 && (
          <div className="event-playlist-container">
            <p className="text-30-semibold">Featured Events</p>
            <ul className="event-playlist card-grid-sm">
              {editorPosts.map((post: EventCardType, i: number) => (
                <EventCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}
        <Suspense fallback={<Skeleton className="view-skeleton" />}>
          <View id={post?._id} />
        </Suspense>
      </section>
    </div>
  );
};

export default Page;
