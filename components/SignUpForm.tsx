'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { signUpSchema } from '@/lib/validation';
import { checkIfUsernameExists, checkIfEmailExists } from '@/lib/actions';
import { signIn } from 'next-auth/react';
import { handleBlur } from '@/lib/utils';

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

  const onBlurHandler = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleBlur({
      e,
      formData,
      schema: signUpSchema.innerType(),
      setErrors,
      setTouched,
    });
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

      // Automatically log the user in
      const loginResult = await signIn('credentials', {
        redirect: false,
        email: formData.email, // Pass email
        password: formData.password, // Pass password
      });

      if (loginResult?.error) {
        setErrors((prev) => ({
          ...prev,
          form: loginResult.error || 'Unknown error',
        }));
        console.error('Login after sign-up failed:', loginResult.error);
      } else {
        console.log('Signed in successfully after sign-up');
        onClose();
      }

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
      <h1 className="form-title">Join Texas Waterway</h1>
      <div className="flex space-x-4">
        <div className="flex flex-col w-full">
          <input
            type="text"
            name="name"
            placeholder="First Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={onBlurHandler}
            className={`border p-2 rounded w-full ${
              touched.name
                ? formData.name
                  ? errors.name
                    ? 'form-input_error'
                    : 'form-input_success'
                  : 'form-input_error'
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
            onBlur={onBlurHandler}
            className={`border p-2 rounded w-full ${
              touched.lastName
                ? formData.lastName
                  ? errors.lastName
                    ? 'form-input_error'
                    : 'form-input_success'
                  : 'form-input_error'
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
          onBlur={onBlurHandler}
          className={`border p-2 rounded w-full ${
            touched.username
              ? formData.username
                ? errors.username
                  ? 'form-input_error'
                  : 'form-input_success'
                : 'form-input_error'
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
          onBlur={onBlurHandler}
          className={`border p-2 rounded w-full ${
            touched.email
              ? formData.email
                ? errors.email
                  ? 'form-input_error'
                  : 'form-input_success'
                : 'form-input_error'
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
          onBlur={onBlurHandler}
          className={`border p-2 rounded w-full ${
            touched.password
              ? formData.password
                ? errors.password
                  ? 'form-input_error'
                  : 'form-input_success'
                : 'form-input_error'
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
              ? 'form-input_success'
              : 'form-input_error'
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
          onBlur={onBlurHandler}
          className={`border p-2 rounded w-full ${
            touched.image
              ? formData.image
                ? errors.image
                  ? 'form-input_error'
                  : 'form-input_success'
                : 'form-input_error'
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
          onBlur={onBlurHandler}
          className={`border p-2 rounded w-full ${
            touched.bio
              ? formData.bio
                ? errors.bio
                  ? 'form-input_error'
                  : 'form-input_success'
                : 'form-input_error'
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
