import React, { useState } from 'react';
import useDeleteNote from '../hooks/useDeleteNote';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditNoteModal from './EditNoteModal';

interface NotesCardProps {
  id: string;
  title: string;
  description: string;
}

const NotesCard: React.FC<NotesCardProps> = ({ id, title, description }) => {
  const { deleteNote } = useDeleteNote();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleDeleteNote = async () => {
    try {
      const response = await deleteNote(id);
      if(response.success){
        toast.success("Note deleted successfully");
      }else{
        toast.error("Failed to delete note");
      }
    } catch(error) {
      toast.error("Failed to delete note");
    }
  }

  return (
    <div className="relative h-[18rem] w-[25rem] border-2 border-black rounded-xl">
      <div className="h-[4rem] bg-blue-700 rounded-tr-xl rounded-tl-xl text-white flex items-center p-4">
        {title}
      </div>

      <div className="flex p-4 h-[9rem] my-[1rem] overflow-scroll">
        {description}
      </div>

      <div className="h-[3rem] w-[100%] rounded-br-xl rounded-bl-xl bg-blue-700 text-white absolute bottom-0 flex flex-row items-center justify-center gap-x-8">
        <div className="cursor-pointer" onClick={handleModal}>
          Edit
        </div>
        <div className="cursor-pointer" onClick={handleDeleteNote}>
          Delete
        </div>
      </div>

      <ToastContainer/>
      {isModalOpen && <EditNoteModal noteId={id} initialTitle={title} initialDescription={description} onClose={handleModal} />}
    </div>
  );
};

export default NotesCard;