'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { signUpSchema } from '@/lib/validation';
import {
  checkIfUsernameExists,
  checkIfEmailExists,
} from '@/app/actions/authActions';
import { signIn } from 'next-auth/react';
import { handleBlur, uploadImageToCloudinary } from '@/lib/utils';
import { createUser } from '@/app/actions/userActions';
import ImageUpload from './ImageUpload';
import { ChevronDown } from 'lucide-react';
import { lakes } from '@/lib/data/lakes';

const SignUpForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    username: '',
    email: '',
    lake: '',
    password: '',
    confirmPassword: '',
    image: '',
    bio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [useURL, setUseURL] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

    if (name === 'confirmPassword') {
      setIsTyping(true); // Mark as typing
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const onBlurHandler = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

      // Handle image upload if a file is provided
      const imageValue = useURL
        ? formData.image
        : imageFile
          ? await uploadImageToCloudinary(imageFile, 'users')
          : '';

      setFormData((prevFormData) => ({
        ...prevFormData,
        image: imageValue,
      }));

      // Concatenate first name and last name
      const fullName = `${formData.name} ${formData.lastName}`.trim();

      const formValues = {
        name: formData.name,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        lake: formData.lake,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        bio: formData.bio,
        image: imageValue,
      };

      signUpSchema.parseAsync(formValues);

      // Create the user
      const result = await createUser({
        name: fullName,
        username: formData.username,
        email: formData.email,
        lake: formData.lake,
        password: formData.password,
        bio: formData.bio,
        image: imageValue,
      });
      console.log('result: ', JSON.stringify(result));

      if (!result.success) {
        throw new Error(result.error || 'Failed to sign up');
      }

      // Automatically log the user in
      const loginResult = await signIn('credentials', {
        redirect: false,
        identifier: formData.email.toLowerCase(),
        password: formData.password,
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
      console.error('Error during sign-up:');
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

  useEffect(() => {
    const validateConfirmPassword = async () => {
      try {
        if (!formData.confirmPassword) {
          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
          return;
        }
        await signUpSchema.parseAsync({
          ...formData,
          confirmPassword: formData.confirmPassword,
        });
        setErrors((prev) => {
          const { confirmPassword, ...otherErrors } = prev;
          return { ...otherErrors, confirmPassword: '' };
        });
      } catch (err) {
        if (err instanceof z.ZodError) {
          const confirmPasswordError = err.errors.find(
            (e) => e.path[0] === 'confirmPassword',
          );
          setErrors((prev) => ({
            ...prev,
            confirmPassword: confirmPasswordError
              ? confirmPasswordError.message
              : '',
          }));
        }
      }
    };

    if (formData.password) {
      validateConfirmPassword();
    }
  }, [formData.password, formData.confirmPassword]);

  // Update form validity whenever formData changes
  useEffect(() => {
    const validateForm = async () => {
      try {
        const imageValue = useURL ? formData.image || '' : imageFile || '';
        await signUpSchema.parseAsync({ ...formData, image: imageValue });
        setIsFormValid(true); // Form is valid if no error is thrown
      } catch (err) {
        if (err instanceof z.ZodError) {
          setIsFormValid(false); // Form is invalid
        }
      }
    };

    validateForm();
  }, [formData, useURL, imageFile]);

  return (
    <form onSubmit={handleSubmit} className="signup">
      <h1 className="signup-title">Join Texas Waterway</h1>
      <div className="signup-input-dual-container">
        <div className="signup-input-container">
          <input
            type="text"
            name="name"
            placeholder="First Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={onBlurHandler}
            className={`signup-input ${
              touched.name
                ? formData.name
                  ? errors.name
                    ? 'form-input-error'
                    : 'form-input-success'
                  : 'form-input-error'
                : ''
            }`}
          />
          {errors.name && <p className="signup-error">{errors.name}</p>}
        </div>
        <div className="signup-input-container">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={onBlurHandler}
            className={`signup-input ${
              touched.lastName
                ? formData.lastName
                  ? errors.lastName
                    ? 'form-input-error'
                    : 'form-input-success'
                  : 'form-input-error'
                : ''
            }`}
          />
          {errors.lastName && <p className="signup-error">{errors.lastName}</p>}
        </div>
      </div>
      <div className="signup-input-container">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          onBlur={onBlurHandler}
          className={`signup-input ${
            touched.username
              ? formData.username
                ? errors.username
                  ? 'form-input-error'
                  : 'form-input-success'
                : 'form-input-error'
              : ''
          }`}
        />
        {errors.username && <p className="signup-error">{errors.username}</p>}
      </div>
      <div className="signup-input-container">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={onBlurHandler}
          className={`signup-input ${
            touched.email
              ? formData.email
                ? errors.email
                  ? 'form-input-error'
                  : 'form-input-success'
                : 'form-input-error'
              : ''
          }`}
        />
        {errors.email && <p className="signup-error">{errors.email}</p>}
      </div>
      <div className="signup-dropdown-container">
        <select
          id="lake"
          name="lake"
          value={formData.lake}
          required
          onBlur={onBlurHandler}
          onChange={handleChange}
          className={`signup-dropdown ${
            touched.lake
              ? formData.lake
                ? errors.lake
                  ? 'form-input-error'
                  : 'form-input-success'
                : 'form-input-error'
              : ''
          }`}
        >
          <option value="" disabled>
            Select a lake
          </option>
          {lakes.map((lake) => (
            <option key={lake.name} value={lake.id}>
              {lake.name}
            </option>
          ))}
        </select>
        <ChevronDown className="signup-dropdown-icon" />
        {errors.lake && <p className="signup-error">{errors.lake}</p>}
      </div>
      <div className="signup-input-container">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={onBlurHandler}
          className={`signup-input ${
            touched.password
              ? formData.password
                ? errors.password
                  ? 'form-input-error'
                  : 'form-input-success'
                : 'form-input-error'
              : ''
          }`}
        />
        {errors.password && <p className="signup-error">{errors.password}</p>}
      </div>
      <div className="signup-input-container">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`signup-input ${
            formData.confirmPassword
              ? passwordMatch
                ? 'form-input-success'
                : 'form-input-error'
              : ''
          }`}
        />
        {!isTyping && errors.confirmPassword && (
          <p className="signup-error">{errors.confirmPassword}</p>
        )}
      </div>
      <div className="signup-input-container">
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
          buttonCentered={true}
        />
      </div>
      <div className="signup-input-container">
        <textarea
          name="bio"
          placeholder="Bio (optional)"
          value={formData.bio}
          onChange={handleChange}
          onBlur={onBlurHandler}
          className={`signup-input ${
            touched.bio
              ? formData.bio
                ? errors.bio
                  ? 'form-input-error'
                  : 'form-input-success'
                : 'form-input-error'
              : ''
          }`}
        />
        {errors.bio && <p className="signup-error">{errors.bio}</p>}
      </div>
      <button
        type="submit"
        disabled={!isFormValid}
        className={`signup-button ${
          isFormValid ? 'signup-button-valid' : 'signup-button-disabled'
        }`}
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUpForm;
