'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { signUpSchema } from '@/lib/validation';
import { checkIfUsernameExists, checkIfEmailExists } from '@/lib/actions';

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
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // Reset error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: '' }));

    // If passwords are being updated, check if they match
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(
        name === 'password'
          ? value === formData.confirmPassword
          : value === formData.password,
      );
    }
  };

  const handleBlur = async (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Mark the field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Skip validation for empty fields
    if (!value) {
      // If the field is empty, mark it as invalid but don't show an error message
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    try {
      // Access the inner schema of signUpSchema
      const baseSchema = signUpSchema.innerType();

      // Validate the field by creating a partial schema for the specific field
      const fieldSchema = z.object({ [name]: baseSchema.shape[name] });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data with zod asynchronously
      await signUpSchema.parseAsync(formData);

      // Check username and email availability
      const usernameExists = await checkIfUsernameExists(formData.username);
      const emailExists = await checkIfEmailExists(formData.email);

      if (usernameExists) {
        setErrors((prev) => ({
          ...prev,
          username: 'Username is already taken',
        }));
        return;
      }

      if (emailExists) {
        setErrors((prev) => ({ ...prev, email: 'Email is already in use' }));
        return;
      }

      // Concatenate first name and last name
      const fullName = `${formData.name} ${formData.lastName}`.trim();

      // Submit the form
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

  // Update form validity whenever formData changes
  useEffect(() => {
    const validateForm = async () => {
      try {
        await signUpSchema.parseAsync(formData); // Validate asynchronously
        setIsFormValid(true); // Form is valid if no error is thrown
      } catch (err) {
        if (err instanceof z.ZodError) {
          setIsFormValid(false); // Form is invalid
        }
      }
    };

    validateForm();
  }, [formData]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        <div className="flex flex-col w-full">
          <input
            type="text"
            name="name"
            placeholder="First Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`border p-2 rounded w-full ${
              touched.name
                ? formData.name
                  ? errors.name
                    ? 'bg-red-100 border-red-500'
                    : 'bg-green-100 border-green-500'
                  : 'bg-red-100'
                : ''
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="flex flex-col w-full">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`border p-2 rounded w-full ${
              touched.lastName
                ? formData.lastName
                  ? errors.lastName
                    ? 'bg-red-100 border-red-500'
                    : 'bg-green-100 border-green-500'
                  : 'bg-red-100'
                : ''
            }`}
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </div>
      </div>
      <div className="flex flex-col w-full space-y-1">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`border p-2 rounded w-full ${
            touched.username
              ? formData.username
                ? errors.username
                  ? 'bg-red-100 border-red-500'
                  : 'bg-green-100 border-green-500'
                : 'bg-red-100'
              : ''
          }`}
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}
      </div>
      <div className="flex flex-col w-full space-y-1">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`border p-2 rounded w-full ${
            touched.email
              ? formData.email
                ? errors.email
                  ? 'bg-red-100 border-red-500'
                  : 'bg-green-100 border-green-500'
                : 'bg-red-100'
              : ''
          }`}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div className="flex flex-col w-full space-y-1">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`border p-2 rounded w-full ${
            touched.password
              ? formData.password
                ? errors.password
                  ? 'bg-red-100 border-red-500'
                  : 'bg-green-100 border-green-500'
                : 'bg-red-100'
              : ''
          }`}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className={`p-2 rounded border ${
          formData.password && formData.confirmPassword
            ? passwordMatch
              ? 'bg-green-100 border-green-500'
              : 'bg-red-100 border-red-500'
            : ''
        }`}
      />
      {errors.confirmPassword && (
        <p className="text-red-500">{errors.confirmPassword}</p>
      )}
      <div className="flex flex-col w-full space-y-1">
        <input
          type="url"
          name="image"
          placeholder="Profile Image URL"
          value={formData.image}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`border p-2 rounded w-full ${
            touched.image
              ? formData.image
                ? errors.image
                  ? 'bg-red-100 border-red-500'
                  : 'bg-green-100 border-green-500'
                : 'bg-red-100'
              : ''
          }`}
        />
        {errors.image && <p className="text-red-500">{errors.image}</p>}
      </div>
      <div className="flex flex-col w-full space-y-1">
        <textarea
          name="bio"
          placeholder="Bio (optional)"
          value={formData.bio}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`border p-2 rounded w-full ${
            touched.bio
              ? formData.bio
                ? errors.bio
                  ? 'bg-red-100 border-red-500'
                  : 'bg-green-100 border-green-500'
                : 'bg-gray-100'
              : ''
          }`}
        />
        {errors.bio && <p className="text-red-500">{errors.bio}</p>}
      </div>
      <button
        type="submit"
        disabled={!isFormValid}
        className={`px-4 py-2 rounded text-white ${
          isFormValid ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUpForm;
