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
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        name="identifier"
        placeholder="Email"
        value={formData.identifier}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 rounded text-white"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
