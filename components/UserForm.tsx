'use client';

import React, { useState, useEffect } from 'react';
import { updateUser, deleteUser, getUserById } from '@/app/actions/userActions';
import { signOut } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { handleBlur, uploadImageToCloudinary } from '@/lib/utils';
import { userFormSchema } from '@/lib/validation';
import ImageUpload from './ImageUpload';
import { z } from 'zod';
import { Textarea } from './ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

const UserForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    image: '',
    bio: '',
  });

  const [existingUser, setExistingUser] = useState<any>(null);
  const [useURL, setUseURL] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const session = await getSession();
      if (session?.user) {
        const userId = session.id;
        try {
          const { data: user } = await getUserById(userId);
          setExistingUser(user);
          setFormData({
            image: user?.image || '',
            bio: user?.bio || '',
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUserData();
  }, []);

  // Update form validity whenever formData changes
  useEffect(() => {
    const validateForm = async () => {
      if (isLoading) return; // Skip validation during loading

      try {
        const imageValue = useURL
          ? formData.image || '' // Ensure a string is passed for URL validation
          : imageFile || '';
        await userFormSchema.parseAsync({
          ...formData,
          image: imageValue,
        });
        setIsFormValid(true); // Form is valid if no error is thrown
      } catch (err) {
        if (err instanceof z.ZodError) {
          setIsFormValid(false); // Form is invalid
        }
      }
    };

    validateForm();
  }, [formData, useURL, imageFile, isLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      schema: userFormSchema,
      setErrors,
      setTouched,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageValue = useURL
        ? formData.image
        : imageFile
          ? await uploadImageToCloudinary(imageFile, 'users')
          : '';

      const updatedFormData = { ...formData, image: imageValue };
      await userFormSchema.parseAsync(updatedFormData); // Zod validation

      if (!existingUser?._id) {
        alert('User ID is missing. Unable to update profile.');
        return;
      }
      const result = await updateUser(existingUser._id, updatedFormData);

      if (result.success) {
        alert('Profile updated successfully!');
        onClose();
        router.push(`/user/${existingUser?.username}`); // Navigate to the home page
        router.refresh(); // Refresh the home page
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      try {
        const result = await deleteUser(existingUser._id);
        if (result.success) {
          alert('Account deleted successfully!');
          signOut({ callbackUrl: '/' });
        } else {
          alert(`Failed to delete account: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An unexpected error occurred while deleting your account.');
      }
    }
  };

  const previewImageSrc = useURL
    ? formData.image
    : imageFile
      ? URL.createObjectURL(imageFile)
      : '/fallback/default-avatar.png';

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2 className="user-form-title">Edit Profile</h2>
      <div className="user-form-top">
        {isLoading ? (
          <Skeleton className="user-form-avatar-skeleton">
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </Skeleton>
        ) : (
          <div className="user-form-avatar-container">
            <img
              src={previewImageSrc}
              alt="Profile"
              className="user-form-avatar"
            />
          </div>
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
        existing={existingUser}
        buttonCentered={true}
      />
      <div className="user-form-bottom">
        <label htmlFor="description" className="user-form-label">
          Bio
        </label>
        {isLoading ? (
          <Skeleton className="user-form-textarea-skeleton">
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </Skeleton>
        ) : (
          <>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={formData.bio || ''}
              required
              placeholder="Event Description"
              onBlur={onBlurHandler}
              onChange={handleChange}
              className={`user-form-textarea ${
                touched.bio
                  ? formData.bio
                    ? errors.bio
                      ? 'form-input-error'
                      : 'form-input-success'
                    : 'form-input-error'
                  : ''
              }`}
            />
            {errors.bio && <p className="event-form-error">{errors.bio}</p>}
          </>
        )}
      </div>
      <div className="user-form-buttons">
        <button
          type="button"
          className="user-form-button-delete"
          onClick={handleDelete}
        >
          Delete Account
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className={`user-form-button ${
            isFormValid ? 'user-form-button-valid' : 'user-form-button-disabled'
          }`}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UserForm;
