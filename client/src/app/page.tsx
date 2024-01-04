'use client'
import React, {useEffect} from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/notes");
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen">
    <div className="bg-blue-700 h-[22rem] w-[20rem] p-6 flex flex-col items-center justify-center text-white rounded-xl">
      <h1 className="text-[1.5rem] underline underline-offset-8 mb-[2rem]">
        Welcome to MemoEase!
      </h1>
      <p className="text-center">
        Unlock the power of effortless organization and enhanced productivity with MemoEase. 
        Seamlessly designed for simplicity and efficiency, MemoEase is your digital haven for note-taking and 
        task management.
      </p>
    </div>
    <button className="bg-blue-700 h-[4rem] w-[20rem] mt-[2rem] rounded-xl text-white" onClick={handleClick}>
      View my Notes
    </button>
  </main>
  
  )
}
