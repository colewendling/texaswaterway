import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  lake: z.string().min(3),
  image: z.union([
    z
      .string()
      .url()
      .refine(async (url) => {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          const contentType = res.headers.get('content-type');
          return contentType?.startsWith('image/');
        } catch {
          return false;
        }
      }, 'Image must be a valid URL pointing to an image'),
    z
      .custom<File>((value) => value instanceof File)
      .refine(
        (file) => file.type.startsWith('image/'),
        'Uploaded file must be an image',
      ),
  ]),
  pitch: z.string().min(10),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters long')
      .max(50),
    username: z
      .string()
      .min(3, 'Username must be 3 to 15 characters long')
      .max(15),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be no more than 128 characters long'),
    confirmPassword: z.string(),
    image: z.union([
      z
        .string()
        .url()
        .refine(async (url) => {
          try {
            const res = await fetch(url, { method: 'HEAD' });
            const contentType = res.headers.get('content-type');
            return contentType?.startsWith('image/');
          } catch {
            return false;
          }
        }, 'Image must be a valid URL pointing to an image'),
      z
        .custom<File>((value) => value instanceof File)
        .refine(
          (file) => file.type.startsWith('image/'),
          'Uploaded file must be an image',
        ),
    ]),
    bio: z
      .string()
      .max(200, 'Bio must be no more than 200 characters long')
      .optional(),
    lake: z.string().min(3, 'Please select a lake'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Specify which field the error belongs to
  });

export const userFormSchema = z.object({
  image: z.union([
    z
      .string()
      .url()
      .refine(async (url) => {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          const contentType = res.headers.get('content-type');
          return contentType?.startsWith('image/');
        } catch {
          return false;
        }
      }, 'Image must be a valid URL pointing to an image'),
    z
      .custom<File>((value) => value instanceof File)
      .refine(
        (file) => file.type.startsWith('image/'),
        'Uploaded file must be an image',
      ),
  ]),
  lake: z.string().min(3, 'Please select a lake'),
  bio: z
    .string()
    .max(200, 'Bio must be no more than 200 characters long')
    .optional(),
});
