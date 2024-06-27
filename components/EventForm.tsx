'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Trash } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import { useActionState } from 'react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  checkIfTitleExists,
} from '@/app/actions/eventActions';
import { uploadImageToCloudinary } from '@/lib/utils';
import { handleBlur } from '@/lib/utils';
import ImageUpload from './ImageUpload';

const EventForm = ({ existingEvent }: { existingEvent?: any }) => {
  const [pitch, setPitch] = useState(existingEvent?.pitch || '');
  const [formData, setFormData] = useState({
    title: existingEvent?.title || '',
    description: existingEvent?.description || '',
    category: existingEvent?.category || '',
    image: existingEvent?.image || '',
    pitch: existingEvent?.pitch || '',
  });

  useEffect(() => {
    if (existingEvent) {
      setPitch(existingEvent?.pitch || '');
      setFormData((prevFormData) => ({
        ...prevFormData,
        pitch: existingEvent?.pitch || '',
      }));
    }
  }, [existingEvent]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!existingEvent;
  const [useURL, setUseURL] = useState(existingEvent?.image ? true : false);

  const handlePitchChange = (value: string | undefined) => {
    setPitch(value || '');
    setFormData((prev) => ({
      ...prev,
      pitch: value || '',
    }));
  };
  // Update form validity whenever formData changes
  useEffect(() => {
    const validateForm = async () => {
      try {
        const imageValue = useURL
          ? formData.image || '' // Ensure a string is passed for URL validation
          : imageFile || ''; // Ensure a `File` object or empty string is passed for file validation

        await formSchema.parseAsync({
          ...formData,
          image: imageValue, // Pass the appropriate image value
        });

        setIsFormValid(true); // Form is valid if no error is thrown
      } catch (err) {
        if (err instanceof z.ZodError) {
          setIsFormValid(false); // Form is invalid
        }
      }
    };

    validateForm();
  }, [formData, useURL, imageFile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (!touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const onBlurHandler = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleBlur({
      e,
      formData,
      schema: formSchema,
      setErrors,
      setTouched,
    });
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const currentTitle = formData.get('title') as string;

      // Check if the title is different from the existing title in edit mode
      if (
        !isEditMode ||
        (isEditMode && currentTitle !== existingEvent?.title)
      ) {
        const titleExists = await checkIfTitleExists(currentTitle);
        if (titleExists) {
          setFormData((prev) => ({ ...prev, title: currentTitle }));
          setErrors((prev) => ({
            ...prev,
            title: `The title "${currentTitle}" is taken. Please choose another.`,
          }));
          return; // Stop the form submission if the title already exists
        }
      }

      const imageUrl = useURL
        ? (formData.get('image') as string) || ''
        : imageFile
          ? await uploadImageToCloudinary(imageFile, 'events')
          : '';

      formData.set('image', imageUrl);

      const formValues = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        image: imageUrl,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      let result;
      if (existingEvent) {
        // Update the event if it exists
        result = await updateEvent(
          existingEvent._id,
          formData,
          formValues.pitch,
        );
      } else {
        // Create a new event
        result = await createEvent(prevState, formData, formValues.pitch);
      }

      if (result.status === 'SUCCESS') {
        toast({
          title: 'Success',
          description: `Your event has been ${
            existingEvent ? 'updated' : 'created'
          } successfully`,
        });
        router.push(`/event/${result.slug.current}`);
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
        router.push('/');
      } catch (error) {
        alert('Failed to delete the event.');
      }
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: '',
    status: 'INITIAL',
  });

  return (
    <form action={formAction} className="event-form">
      {isEditMode && <h1 className="form-title">Edit your Event</h1>}
      <div>
        <label htmlFor="title" className="event-form-label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          defaultValue={existingEvent?.title || formData.title}
          required
          placeholder="Event Title"
          onBlur={onBlurHandler}
          onChange={handleChange}
          className={`event-form-input ${
            touched.title
              ? formData.title
                ? errors.title
                  ? 'form-input-error'
                  : 'form-input-success'
                : 'form-input-error'
              : ''
          }`}
        />
        {errors.title && <p className="event-form-error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="event-form-label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          defaultValue={existingEvent?.description || formData.description}
          required
          placeholder="Event Description"
          onBlur={onBlurHandler}
          onChange={handleChange}
          className={`event-form-textarea ${
            touched.description
              ? formData.description
                ? errors.description
                  ? 'form-input-error'
                  : 'form-input-success'
                : 'form-input-error'
              : ''
          }`}
        />
        {errors.description && (
          <p className="event-form-error">{errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="event-form-label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          defaultValue={existingEvent?.category || formData.category}
          required
          placeholder="Event Category (Fishing, Trade, Meetup...)"
          onBlur={onBlurHandler}
          onChange={handleChange}
          className={`event-form-input ${
            touched.category
              ? formData.category
                ? errors.category
                  ? 'form-input-error'
                  : 'form-input-success'
                : 'form-input-error'
              : ''
          }`}
        />
        {errors.category && (
          <p className="event-form-error">{errors.category}</p>
        )}
      </div>

      <ImageUpload
        useURL={useURL}
        setUseURL={setUseURL}
        setImageFile={setImageFile}
        setFormData={setFormData}
        setErrors={setErrors}
        imageFile={imageFile}
        formData={formData}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        onBlurHandler={onBlurHandler}
        existing={existingEvent}
        buttonCentered={false}
      />
      <div data-color-mode="light">
        <label htmlFor="pitch" className="event-form-label">
          Event Pitch
        </label>
        <div className="my-3">
          <MDEditor
            value={pitch}
            onChange={handlePitchChange}
            id="pitch"
            preview="edit"
            height={300}
            style={{ borderRadius: 15, overflow: 'hidden' }}
            textareaProps={{
              placeholder:
                'Briefly describe your event and add relevant details',
            }}
            previewOptions={{
              disallowedElements: ['style'],
            }}
          />
        </div>
        {errors.pitch && <p className="event-form-error">{errors.pitch}</p>}
      </div>
      <div
        className={`event-form-button-container ${
          isEditMode ? 'justify-between' : 'justify-center'
        }`}
      >
        {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            className="event-form-button-delete"
          >
            <Trash className="event-form-delete-icon" />
          </button>
        )}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`event-form-button-submit ${
            isFormValid
              ? 'event-form-button-submit-valid'
              : 'event-form-button-submit-disabled'
          }`}
        >
          {isEditMode ? <>Save</> : <>Submit</>}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
