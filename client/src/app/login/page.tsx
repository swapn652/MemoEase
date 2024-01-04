'use client'
import React, { useState } from 'react';
import login from '../hooks/login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Login = () => {
  const { setToken } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const currToken = await login(formData);
      setToken(currToken.token);
      toast.success('Successful login');

      // Redirect to the Notes page
      setInterval(() => {
        router.push('/notes');
      }, 2000);

    } catch (error: any) {
      toast.error('Failed to login', error);
    }
  };

  return (
    <div className="bg-gray-300 w-screen h-screen flex items-center justify-center">
      <div className="h-[26rem] w-[22rem] bg-white rounded-xl flex flex-col justify-center items-center">
        <div className="bg-blue-600 w-[15rem] text-white py-2 flex justify-center text-[1.1rem] rounded-xl">
          Log In
        </div>

        <form className="mt-[2rem] flex flex-col items-center gap-y-6" onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-[18rem] p-2 rounded-lg border-2 border-gray-500"
          />
          <input
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-[18rem] p-2 rounded-lg border-2 border-gray-500"
          />
          <button className="bg-blue-600 w-[18rem] h-[3rem] rounded-xl text-white" type="submit">
            Submit
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
