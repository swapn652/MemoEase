'use client'
import React, { useState, useEffect } from 'react';
import getCurrentLoggedInUserData from '../hooks/getCurrentLoggedInUserData';
import { useAuth } from '../context/AuthContext';
import { destroyCookie } from 'nookies';

export const Navbar = () => {
  const { token, setToken } = useAuth();
  const { userData, loading, error } = getCurrentLoggedInUserData();

  useEffect(() => {
    console.log("usedata: ", userData);
  }, [userData])

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleLogout = () => {
    destroyCookie(null, 'token', { path: '/' });
    setToken(null);
  }

  return (
    <div className="w-full bg-blue-700 text-white h-[6rem] flex flex-row items-center justify-between px-[2rem] fixed top-0 z-[10]">
      <a href="/"><h1 className="text-[2rem] cursor-pointer">MemoEase</h1></a>
      {token ? (
        <div className="flex flex-row gap-x-2 items-center">
          <img src="./user.png" alt="user_icon" className="w-[2.5rem] h-[2.5rem]" />
          <div className = "flex flex-col">
            <h1 className="text-[1.1rem]">{userData?.username}</h1>
            <h1 className="text-pink-200 underline underline-offset-2 cursor-pointer" onClick={handleLogout}>Logout</h1>
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center text-white gap-x-4">
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </div>
      )}
    </div>
  );
};
