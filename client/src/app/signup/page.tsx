import React from 'react';

const SignUp = () => {
  return (
    <div className = "bg-gray-300 w-screen h-screen flex items-center justify-center">
        <div className = "h-[30rem] w-[24rem] bg-white rounded-2xl flex flex-col justify-center items-center">
            <div className = "bg-blue-600 w-[15rem] text-white  py-2 flex justify-center text-[1.1rem] rounded-xl">
                Sign Up
            </div>

            <form className="mt-[2rem] flex flex-col items-center gap-y-6">
                <input placeholder = "Username" className = "w-[18rem] p-2 rounded-lg border-2 border-gray-500"/>
                <input placeholder = "Email" type = "email" className = "w-[18rem] p-2 rounded-lg border-2 border-gray-500"/>
                <input placeholder = "Password" type = "password" className = "w-[18rem] p-2 rounded-lg border-2 border-gray-500"/>
                <button className = "bg-blue-600 w-[18rem] h-[3rem] rounded-xl text-white">
                    Submit
                </button>
            </form>

        </div>
    </div>
  )
}

export default SignUp;
