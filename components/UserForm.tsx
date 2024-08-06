'use client';

import React, { useState, useEffect } from 'react';
import { updateUser, deleteUser, getUserById } from '@/app/actions/userActions';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { handleBlur, uploadImageToCloudinary } from '@/lib/utils';
import { userFormSchema } from '@/lib/validation';
import ImageUpload from './ImageUpload';
import { z } from 'zod';
import { Textarea } from './ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const UserForm = ({ onClose }: { onClose: () => void }) => {
  const { data: session, update } = useSession();
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const previewImageSrc = useURL
    ? formData.image && formData.image.trim() !== ''
      ? formData.image
      : '/fallback/default-avatar.png'
    : imageFile
      ? URL.createObjectURL(imageFile)
      : '/fallback/default-avatar.png';

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
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
      if (isLoading) return;
      try {
        const imageValue = useURL ? formData.image || '' : imageFile || '';
        await userFormSchema.parseAsync({
          ...formData,
          image: imageValue,
        });
        setIsFormValid(true);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setIsFormValid(false);
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
    setIsLoading(true);
    try {
      const imageValue = useURL
        ? formData.image
        : imageFile
          ? await uploadImageToCloudinary(imageFile, 'users')
          : '';

      const updatedFormData = { ...formData, image: imageValue };
      await userFormSchema.parseAsync(updatedFormData);

      if (!existingUser?._id) {
        toast({
          title: 'Error',
          description: 'User ID is missing. Unable to update profile.',
          variant: 'destructive',
        });
        return;
      }
      const result = await updateUser(existingUser._id, updatedFormData);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully!',
        });

        // Update the session with the new image
        await update({
          ...session,
          user: {
            ...session?.user,
            image: imageValue, // Update the image URL
          },
        });

        onClose();
        router.push(`/user/${existingUser?.username}`);
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      e.preventDefault();
      setIsLoading(true);
      try {
        const result = await deleteUser(existingUser._id);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Account deleted successfully!',
          });
          signOut({ callbackUrl: '/' });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to delete account.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: 'Error',
          description:
            'An unexpected error occurred while deleting your account.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

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
              src={previewImageSrc || '/fallback/default-avatar.png'}
              alt="Profile"
              className="user-form-avatar"
              onError={(e) => {
                e.currentTarget.src = '/fallback/default-avatar.png';
              }}
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
          <div className="user-form-bio">
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
            </>
            {errors.bio && <p className="event-form-error">{errors.bio}</p>}
          </div>
        )}
      </div>
      <div className="user-form-buttons">
        <button
          type="button"
          disabled={isLoading}
          className="user-form-button-delete"
          onClick={handleDelete}
        >
          {isLoading ? <Loader className="loader" /> : 'Delete Account'}
        </button>
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`user-form-button ${
            isFormValid ? 'user-form-button-valid' : 'user-form-button-disabled'
          }`}
        >
          {isLoading ? <Loader className="loader" /> : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
