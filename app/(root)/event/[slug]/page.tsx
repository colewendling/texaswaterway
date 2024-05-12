import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries/eventQueries';
import { PLAYLIST_BY_SLUG_QUERY } from '@/sanity/lib/queries/playlistQueries';
import Image from 'next/image';
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
    <>
      <section className="orange_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.user?.username}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.user.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{post.user.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.user.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Event Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-results">No details provided for this event.</p>
          )}
        </div>
        <hr className="divider" />
        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Featured Events</p>
            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: EventCardType, i: number) => (
                <EventCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}
        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={post?._id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
