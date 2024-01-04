import React, { useState, FormEvent } from 'react';
import useAddNote from '../hooks/useAddNote';

interface NoteModalProps {
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { addNote } = useAddNote();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await addNote(title, description);

      // Handle the response if needed

      // Close the modal
      onClose();
    } catch (error) {
      // Handle errors
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[27rem] h-[28rem] rounded-xl border-2 border-black flex flex-col items-center justify-center relative">
        <h1
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer"
        >
          X
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-y-4"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[22rem] h-[3rem] border-2 border-black p-2 rounded-lg"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-[22rem] h-[15rem] border-2 border-black p-2 rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white p-4 rounded-lg w-[22rem] h-[3rem] flex items-center justify-center"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
