'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/write-client';
import slugify from 'slugify';
import { parseServerActionResponse } from '@/lib/utils';

// Server Action to create an event
export const createEvent = async (
  state: any,
  form: FormData,
  pitch: string,
) => {
  const session = await getServerSession(authOptions);

  if (!session)
    return parseServerActionResponse({
      error: 'Not signed in',
      status: 'ERROR',
    });

  const { title, description, category, image } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== 'pitch'),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const event = {
      title,
      description,
      category,
      image,
      slug: {
        _type: slug,
        current: slug,
      },
      user: {
        _type: 'reference',
        _ref: session?.id,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: 'event', ...event });

    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};

// Server Action to update an event
export const updateEvent = async (
  eventId: string,
  form: FormData,
  pitch: string,
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return parseServerActionResponse({
      error: 'Not signed in',
      status: 'ERROR',
    });
  }

  const { title, description, category, image } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== 'pitch'),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const updatedEvent = {
      title,
      description,
      category,
      image: image,
      slug: {
        _type: 'slug',
        current: slug,
      },
      pitch,
    };

    const result = await writeClient
      .patch(eventId) // Target the event by ID
      .set(updatedEvent) // Update fields
      .commit(); // Commit the changes

    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};

// Server Action to delete an event
export const deleteEvent = async (eventId: string) => {
  try {
    const result = await writeClient.delete(eventId);
    console.log('Event deleted successfully:', result);
    return { status: 'SUCCESS', _id: eventId };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};
