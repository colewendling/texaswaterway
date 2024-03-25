import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  link: z
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
    }),
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
      .min(3, 'Username must be at least 3 characters long')
      .max(30)
      .refine(async (username) => {
        const isTaken = await checkIfUsernameExists(username);
        return !isTaken;
      }, 'Username is already taken'),
    email: z
      .string()
      .email('Invalid email address')
      .refine(async (email) => {
        const isTaken = await checkIfEmailExists(email);
        return !isTaken;
      }, 'Email is already in use'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be no more than 128 characters long'),
    confirmPassword: z.string(),
    image: z
      .string()
      .url('Invalid URL')
      .optional()
      .refine(async (url) => {
        if (!url) return true; // Allow empty image URL
        try {
          const res = await fetch(url, { method: 'HEAD' });
          const contentType = res.headers.get('content-type');
          return contentType?.startsWith('image/');
        } catch {
          return false;
        }
      }, 'Image must be a valid URL pointing to an image'),
    bio: z
      .string()
      .max(200, 'Bio must be no more than 200 characters long')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Specify which field the error belongs to
  });

async function checkIfUsernameExists(username: string): Promise<boolean> {
  const res = await fetch(
    `/api/auth/check-existing?type=username&value=${username}`,
  );
  const data = await res.json();
  return data.exists;
}

async function checkIfEmailExists(email: string): Promise<boolean> {
  const res = await fetch(`/api/auth/check-existing?type=email&value=${email}`);
  const data = await res.json();
  return data.exists;
}
