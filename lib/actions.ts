'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { parseServerActionResponse } from './utils';
import slugify from 'slugify';
import { writeClient } from '@/sanity/lib/write-client';

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

const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function checkIfUsernameExists(
  username: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/auth/check-existing?type=username&value=${encodeURIComponent(username)}`,
    );
    if (!res.ok) {
      console.error('Failed to check username availability');
      return false;
    }
    const data = await res.json();
    return data.exists;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
}

export async function checkIfEmailExists(email: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/auth/check-existing?type=email&value=${encodeURIComponent(email)}`,
    );
    if (!res.ok) {
      console.error('Failed to check email availability');
      return false;
    }
    const data = await res.json();
    return data.exists;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}