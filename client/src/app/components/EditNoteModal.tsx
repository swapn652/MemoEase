import React, { useState, FormEvent } from 'react';
import useEditNote from '../hooks/useEditNote';

interface EditNoteModalProps {
  noteId: string;
  initialTitle: string;
  initialDescription: string;
  onClose: () => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ noteId, initialTitle, initialDescription, onClose }) => {
  const { editNote } = useEditNote();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await editNote(noteId, title, description);
      onClose();
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[27rem] h-[28rem] rounded-xl border-2 border-black flex flex-col items-center justify-center relative">
        <h1 className="absolute right-4 top-4 cursor-pointer" onClick={onClose}>
          X
        </h1>
        <form className="flex flex-col items-center justify-center gap-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="w-[22rem] h-[3rem] border-2 border-black p-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-[22rem] h-[15rem] border-2 border-black p-2 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="bg-blue-700 text-white p-4 rounded-lg w-[22rem] h-[3rem] flex items-center justify-center" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;
