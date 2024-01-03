'use client'
import React, {useEffect} from 'react';

export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen">
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
  </main>
  
  )
}
