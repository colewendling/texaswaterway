'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import { useActionState } from 'react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const EventForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        link: formData.get('link') as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      // const result = await createIdea(prevState, formData, pitch);

      // if (result.status === 'SUCCESS') {
      //   toast({
      //     title: 'Success',
      //     description: 'Your event has been created successfully',
      //   });
      //   router.push(`/event/${result.id}`)
      // }

      // return result;
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
        description: 'An unexpected error has occured',
        variant: 'destructive',
      });

      return {
        ...prevState,
        error: 'An unexpected error has occured',
        status: 'ERROR',
      };
    }
  };

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
          className="event-form_input"
          required
          placeholder="Event Category (Fishing, Trade, Meetup...)"
        />
        {errors.category && (
          <p className="event-form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="event-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="event-form_input"
          required
          placeholder="Event Image URL"
        />
        {errors.link && <p className="event-form_error">{errors.link}</p>}
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
      <Button
        type="submit"
        className="event-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? 'Submitting...' : 'Submit Your Event'}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default EventForm;
