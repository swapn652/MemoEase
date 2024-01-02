'use client'
import React, { useState } from 'react';
import signUp from '../hooks/signUp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e: any) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
        const user = await signUp(formData);
        toast.success("Successfully registered...");
    } catch(error: any) {
        toast.error("Registration failed ", error);
    }
  }

  return (
    <div className = "bg-gray-300 w-screen h-screen flex items-center justify-center">
        <div className = "h-[30rem] w-[24rem] bg-white rounded-2xl flex flex-col justify-center items-center">
            <div className = "bg-blue-600 w-[15rem] text-white  py-2 flex justify-center text-[1.1rem] rounded-xl">
                Sign Up
            </div>

            <form className="mt-[2rem] flex flex-col items-center gap-y-6" onSubmit = {handleSubmit}>
                <input 
                    placeholder = "Username" 
                    className = "w-[18rem] p-2 rounded-lg border-2 border-gray-500"
                    type = "text"
                    name = "username" 
                    value = {formData.username}
                    onChange = {handleChange} 
                />
                <input 
                    placeholder = "Email" 
                    type = "email" 
                    name = "email"
                    value = {formData.email}
                    onChange = {handleChange}
                    className = "w-[18rem] p-2 rounded-lg border-2 border-gray-500"
                />
                <input 
                    placeholder = "Password" 
                    type = "password"
                    name = "password"
                    value = {formData.password}
                    onChange = {handleChange}  
                    className = "w-[18rem] p-2 rounded-lg border-2 border-gray-500"
                />

                <button className = "bg-blue-600 w-[18rem] h-[3rem] rounded-xl text-white" type = "submit">
                    Submit
                </button>
            </form>

        </div>

        <ToastContainer />
    </div>
  )
}

export default SignUp;
