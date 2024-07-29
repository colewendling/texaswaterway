'use client';

import { Loader } from 'lucide-react';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

const LoginForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    identifier: '', // Email or username
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: formData.identifier.toLowerCase(),
        password: formData.password,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        console.log('Signed in successfully');
        onClose();
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1 className="form-title">Login</h1>
      <input
        type="text"
        name="identifier"
        placeholder="Email or Username"
        value={formData.identifier}
        onChange={handleChange}
        className="login-form-input"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="login-form-input"
      />
      {errorMessage && <p className="login-form-error">{errorMessage}</p>}
      <button type="submit" className="login-form-button" disabled={isLoading}>
        {isLoading ? <Loader className="loader" /> : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
