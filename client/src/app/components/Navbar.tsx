import React from 'react'

export const Navbar = () => {
  return (
    <div className = "w-full bg-blue-700 text-white h-[6rem] flex flex-row items-center justify-between px-[2rem]">
        <h1 className = "text-[2rem]">MemoEase</h1>
        <div className = "flex flex-row gap-x-2 items-center">
            <img src="./user.png" alt="user_icon" className = "w-[2rem] h-[2rem]" />
            <h1 className="text-[1.1rem]">Swapnil Pant</h1>
        </div>
    </div>
  )
}
