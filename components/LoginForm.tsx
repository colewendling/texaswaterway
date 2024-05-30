import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

const LoginForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    identifier: '', // Email or username
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email: formData.identifier, // Pass as "email" to credentials provider
      password: formData.password,
    });

    if (result?.error) {
      setErrorMessage(result.error);
    } else {
      console.log('Signed in successfully');
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1 className="form-title">Login</h1>
      <input
        type="text"
        name="identifier"
        placeholder="Email"
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
      <button type="submit" className="login-form-button">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
