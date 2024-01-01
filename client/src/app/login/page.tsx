import React from 'react'

const Login = () => {
  return (
    <div className = "bg-gray-300 w-screen h-screen flex items-center justify-center">
        <div className = "h-[26rem] w-[22rem] bg-white rounded-xl flex flex-col justify-center items-center">
            <div className = "bg-blue-600 w-[15rem] text-white  py-2 flex justify-center text-[1.1rem] rounded-xl">
                Log In
            </div>

            <form className="mt-[2rem] flex flex-col items-center gap-y-6">
                <input 
                    placeholder = "Username"
                    type = "text" 
                    className = "w-[18rem] p-2 rounded-lg border-2 border-gray-500" />
                <input 
                    placeholder = "Password" 
                    type = "password"
                    className = "w-[18rem] p-2 rounded-lg border-2 border-gray-500" />
                <button className = "bg-blue-600 w-[18rem] h-[3rem] rounded-xl text-white" type = "submit">
                    Submit
                </button>
            </form>
        </div>
    </div>
 )
}

export default Login;
