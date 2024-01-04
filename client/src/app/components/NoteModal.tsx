import React from 'react';

const NoteModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[27rem] h-[28rem] rounded-xl border-2 border-black flex flex-col items-center justify-center relative">
        <h1 className="absolute right-4 top-4 cursor-pointer">X</h1>
        <form className="flex flex-col items-center justify-center gap-y-4">
            <input type="text" placeholder="Title" className="w-[22rem] h-[3rem] border-2 border-black p-2 rounded-lg" />
            <textarea placeholder="Description" className="w-[22rem] h-[15rem] border-2 border-black p-2 rounded-lg" />
            <button className="bg-blue-700 text-white p-4 rounded-lg w-[22rem] h-[3rem] flex items-center justify-center">
                Submit
            </button>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
    