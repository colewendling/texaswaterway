'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send, Save, Trash } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import { useActionState } from 'react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createEvent, updateEvent, deleteEvent } from '@/lib/actions';

const EventForm = ({ existingEvent }: { existingEvent?: any }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState(existingEvent?.pitch || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (existingEvent?.pitch) {
      setPitch(existingEvent.pitch);
    }
  }, [existingEvent, imageFile]);

  const uploadImageToCloudinary = async (file: File) => {
    const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;

    if (!cloudinaryUrl) {
      throw new Error('Cloudinary URL is not defined in environment variables');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await fetch(`${cloudinaryUrl}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.error.message}`);
      }

      const data = await response.json();
      return data.secure_url; // Return the Cloudinary image URL
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Re-throw the error to handle it properly
    }
  };

const handleFormSubmit = async (prevState: any, formData: FormData) => {
  try {
    setIsUploading(true);
    let imageUrl = existingEvent?.image || '';

    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile);
    } 

    // Explicitly add the Cloudinary URL to FormData
    formData.append('link', imageUrl);

    const formValues = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      link: imageUrl, // Cloudinary URL
      pitch,
    };

    await formSchema.parseAsync(formValues);

    let result;
    if (existingEvent) {
      // Update the event if it exists
      result = await updateEvent(existingEvent._id, formData, pitch);
    } else {
      // Create a new event
      result = await createEvent(prevState, formData, pitch);
    }

    if (result.status === 'SUCCESS') {
      toast({
        title: 'Success',
        description: `Your event has been ${
          existingEvent ? 'updated' : 'created'
        } successfully`,
      });
      router.push(`/event/${result._id}`);
    }

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;

      setErrors(fieldErrors as unknown as Record<string, string>);

      toast({
        title: 'Error',
        description: 'Please check your inputs and try again',
        variant: 'destructive',
      });

      return { ...prevState, error: 'validation failed', status: 'ERROR' };
    }

    toast({
      title: 'Error',
      description: 'An unexpected error has occurred',
      variant: 'destructive',
    });

    return {
      ...prevState,
      error: 'An unexpected error has occurred',
      status: 'ERROR',
    };
  }
};

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(existingEvent._id);
        alert('Event deleted successfully');
        router.push('/'); // Redirect to homepage or relevant page
      } catch (error) {
        alert('Failed to delete the event.');
      }
    }
  };

  const isEditMode = !!existingEvent;

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: '',
    status: 'INITIAL',
  });

  return (
    <form action={formAction} className="event-form">
      <div>
          <label htmlFor="title" className="event-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          defaultValue={existingEvent?.title || ''}
          className="event-form_input"
          required
          placeholder="Event Title"
        />
        {errors.title && <p className="event-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="event-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          defaultValue={existingEvent?.description || ''}
          className="event-form_textarea"
          required
          placeholder="Event Description"
        />
        {errors.description && (
          <p className="event-form_error">{errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="event-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          defaultValue={existingEvent?.category || ''}
          className="event-form_input"
          required
          placeholder="Event Category (Fishing, Trade, Meetup...)"
        />
        {errors.category && (
          <p className="event-form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="image" className="event-form_label">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          className="event-form_input"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImageFile(file);
          }}
          required={!existingEvent?.image}
        />
        {isUploading && <p className="event-form_error">Uploading image...</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="event-form_label">
          Event Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: 'hidden' }}
          textareaProps={{
            placeholder: 'Briefly describe your event and add relevant details',
          }}
          previewOptions={{
            disallowedElements: ['style'],
          }}
        />
        {errors.pitch && <p className="event-form_error">{errors.pitch}</p>}
      </div>
      <div
        className={`flex items-center ${
          isEditMode ? 'justify-between' : 'justify-center'
        } mt-6 w-full`}
      >
        {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-12 h-12 flex items-center justify-center bg-red-400 text-white rounded-full hover:bg-red-600 transition"
          >
            <Trash className="w-5 h-5" />
          </button>
        )}
        <Button type="submit" className="event-form_btn_submit">
          {isEditMode ? (
            <>
              Save <Save className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Submit <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
