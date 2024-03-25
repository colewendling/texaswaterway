'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { signUpSchema } from '@/lib/validation';

const SignUpForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: '',
    bio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Validate form data with zod asynchronously
    await signUpSchema.parseAsync(formData);

    // Concatenate first name and last name
    const fullName = `${formData.name} ${formData.lastName}`.trim();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, name: fullName }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to sign up');
    console.log('User created:', result.user);
    onClose();
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Map Zod errors to the error state
      const fieldErrors = err.errors.reduce(
        (acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        },
        {} as Record<string, string>,
      );
      setErrors(fieldErrors);
    } else {
      console.error(err);
    }
  }
};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        name="name"
        placeholder="First Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.username && <p className="text-red-500">{errors.username}</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.email && <p className="text-red-500">{errors.email}</p>}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.password && <p className="text-red-500">{errors.password}</p>}
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.confirmPassword && (
        <p className="text-red-500">{errors.confirmPassword}</p>
      )}
      <input
        type="url"
        name="image"
        placeholder="Profile Image URL"
        value={formData.image}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.image && <p className="text-red-500">{errors.image}</p>}
      <textarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.bio && <p className="text-red-500">{errors.bio}</p>}
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 rounded text-white"
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUpForm;
