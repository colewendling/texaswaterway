'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

const EventForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState('');

  const isPending = false;

  return (
    <form action={() => {}} className="event-form">
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
      <Button type='submit' className='event-form_btn text-white' disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Your Event'}
          <Send className='size-6 ml-2' />
      </Button>
    </form>
  );
};

export default EventForm;
