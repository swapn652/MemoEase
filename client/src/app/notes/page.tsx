'use client'
import React, { useState, useEffect } from 'react';
import NotesCard from '../components/NotesCard';
import { useAuth } from '../context/AuthContext';
import fetchNotes from '../hooks/fetchNotes';
import NoteModal from '../components/NoteModal';

const Notes = () => {
  const { token } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const { notes, loading, error } = fetchNotes();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {token ? (
        <>
          <div className="flex flex-row justify-between px-20 items-center mt-[8rem]">
            <h1 className="text-[2rem]">Your Notes</h1>
            <button className="flex p-4 rounded-xl bg-blue-700 text-white" onClick={handleModal}>
              Add a new note
            </button>
          </div>
          <div className="flex flex-row px-12 flex-wrap gap-10 h-screen w-screen items-center justify-center" style={{ paddingTop: '4rem', paddingBottom: '60rem' }}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : notes.length > 0 ? (
              notes.map(note => (
                <NotesCard key = {note.id} id = {note.id} title = {note.title} description = {note.description} />
              ))
            ) : (
              <div className="flex w-screen h-screen justify-center text-[3rem]">
                No notes found!!! Add a new note.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex w-screen h-screen justify-center items-center text-[3rem]">
          You aren't signed in, sign in first or create a new account!!!
        </div>
      )}

       {isModalOpen && <NoteModal onClose={handleModal}/>}
    </div>
  );
};

export default Notes;

