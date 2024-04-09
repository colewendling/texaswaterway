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
import { createEvent, updateEvent, deleteEvent } from '@/lib/actions';
import { uploadImageToCloudinary } from '@/lib/utils';
import ToggleButton from './ToggleButton';
import { handleBlur } from '@/lib/utils';

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
      setFormData({
        ...formData, 
        pitch: existingEvent?.pitch || '',
      });
      console.log('this ran')
    }
  }, [existingEvent]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [useURL, setUseURL] = useState(existingEvent?.image ? true : false);

  const handleToggle = () => {
    setUseURL((prev) => !prev);
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      image: useURL ? '' : existingEvent?.image || '',
    }));
  };

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
      const imageUrl = useURL
        ? (formData.get('image') as string) || ''
        : imageFile
          ? await uploadImageToCloudinary(imageFile)
          : '';

      formData.set('image', imageUrl);

      const formValues = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        image: imageUrl,
        pitch,
      };

      console.log(`form Values: ${JSON.stringify(formValues)}`);

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
        router.push('/');
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
      {isEditMode && <h1 className="form-title">Edit your Event</h1>}
      <div>
        <label htmlFor="title" className="event-form_label">
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
          className={`event-form_input ${
            touched.title
              ? formData.title
                ? errors.title
                  ? 'form-input_error'
                  : 'form-input_success'
                : 'form-input_error'
              : ''
          }`}
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
          defaultValue={existingEvent?.description || formData.description}
          required
          placeholder="Event Description"
          onBlur={onBlurHandler}
          onChange={handleChange}
          className={`event-form_textarea ${
            touched.description
              ? formData.description
                ? errors.description
                  ? 'form-input_error'
                  : 'form-input_success'
                : 'form-input_error'
              : ''
          }`}
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
          defaultValue={existingEvent?.category || formData.category}
          required
          placeholder="Event Category (Fishing, Trade, Meetup...)"
          onBlur={onBlurHandler}
          onChange={handleChange}
          className={`event-form_input ${
            touched.category
              ? formData.category
                ? errors.category
                  ? 'form-input_error'
                  : 'form-input_success'
                : 'form-input_error'
              : ''
          }`}
        />
        {errors.category && (
          <p className="event-form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="image" className="event-form_label">
          <span className="flex items-center gap-2">
            <span>Upload Image</span>
            <span
              className={`w-3 h-3 rounded-full ${
                imageFile ? 'bg-green-500' : 'bg-gray-400'
              }`}
            ></span>
          </span>
        </label>
        <div>
          <ToggleButton
            label="Image Upload:"
            value={useURL}
            onToggle={handleToggle}
            optionOne="Upload"
            optionTwo="URL"
          />
        </div>
        {!useURL ? (
          <div className="flex flex-col gap-2 mt-2">
            <label
              htmlFor="image"
              className="cursor-pointer inline-block rounded-full bg-gray-200 text-black px-4 py-2 text-sm font-medium hover:bg-gray-500 transition max-w-[120px] text-center"
            >
              Choose File
            </label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
              }}
            />
            {imageFile && (
              <div className="flex items-center gap-2">
                <p className="text-gray-600 text-sm font-medium font-work-sans">
                  <span className="font-bold">Selected Image:</span>{' '}
                  {imageFile.name}
                </p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Selected Preview"
                  className="w-12 h-12 rounded object-cover border border-gray-300"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full space-y-1">
            <input
              type="url"
              name="image"
              placeholder="Image URL"
              defaultValue={existingEvent?.image || formData.image}
              onChange={handleChange}
              onBlur={onBlurHandler}
              className={`event-form_input ${
                touched.image
                  ? formData.image
                    ? errors.image
                      ? 'form-input_error'
                      : 'from-input_success'
                    : 'form-input_error'
                  : ''
              }`}
            />
            {errors.image && <p className="text-red-500">{errors.image}</p>}
          </div>
        )}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="event-form_label">
          Event Pitch
        </label>
        <div className="my-3">
          <MDEditor
            value={pitch}
            onChange={handlePitchChange}
            id="pitch"
            preview="edit"
            height={300}
            style={{ borderRadius: 20, overflow: 'hidden' }}
            textareaProps={{
              placeholder:
                'Briefly describe your event and add relevant details',
            }}
            previewOptions={{
              disallowedElements: ['style'],
            }}
          />
        </div>
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
        <button
          type="submit"
          disabled={!isFormValid}
          className={`event-form_btn_submit ${
            isFormValid ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isEditMode ? <>Save</> : <>Submit</>}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
