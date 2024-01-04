'use client'
import React, { useState, useEffect } from 'react';
import NotesCard from '../components/NotesCard';
import { useAuth } from '../context/AuthContext';

const Notes = () => {
  const { token } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {token ? (
        <>
          <div className="flex flex-row justify-between px-20 items-center mt-[8rem]">
            <h1 className="text-[2rem]">Your Notes</h1>
            <button className="flex p-4 rounded-xl bg-blue-700 text-white">
              Add a new note
            </button>
          </div>
          <div className="flex flex-row px-12 flex-wrap gap-10 h-screen w-screen items-center justify-center" style={{ paddingTop: '4rem', paddingBottom: '60rem' }}>
            {/* Your NotesCard components go here */}
          </div>
        </>
      ) : (
        <div className="flex w-screen h-screen justify-center items-center text-[3rem]">
          You aren't signed in, sign in first or create a new account!!!
        </div>
      )}
    </div>
  );
};

export default Notes;

