import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { lakes } from './data/lakes';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}

export const uploadImageToCloudinary = async (file: File, folder: string) => {
  const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;

  if (!cloudinaryUrl) {
    throw new Error('Cloudinary URL is not defined in environment variables');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  formData.append('folder', folder);

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

export const handleBlur = async ({
  e,
  formData,
  schema,
  setErrors,
  setTouched,
}: {
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;
  formData: Record<string, any>;
  schema: z.ZodObject<any>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) => {
  const { name, value } = e.target;

  // Mark the field as touched
  setTouched((prev) => ({ ...prev, [name]: true }));

  // Skip validation for empty fields
  if (!value) {
    setErrors((prev) => ({ ...prev, [name]: '' }));
    return;
  }

  try {
    // Validate the field by creating a partial schema for the specific field
    const fieldSchema = z.object({ [name]: schema.shape[name] });
    await fieldSchema.parseAsync({ [name]: formData[name] });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  } catch (err) {
    if (err instanceof z.ZodError) {
      setErrors((prev) => ({
        ...prev,
        [name]: err.errors[0]?.message || 'Invalid input',
      }));
    }
  }
};

export const getLakeNameById = (id: string): string | undefined => {
  const lake = lakes.find((l) => l.id === id);
  return lake?.name; // Return the name or undefined if not found
};
