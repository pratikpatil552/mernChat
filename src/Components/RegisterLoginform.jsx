import axios from 'axios';
import React, { useContext } from 'react'
import { useState } from 'react';
import { UserContext } from '../UserContex';

const RegisterLoginform = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setUsername:setLoggedInUsername, setId}=useContext(UserContext)
    const [isregisterpage , setIsregisterpage] = useState(true)

    async function handleSubmit (event){
        event.preventDefault();
        if(isregisterpage){
            const obj = {
                username : username,
                password : password
            }
            const {data} = await axios.post("/register",obj);
            if(!data) return;
            setLoggedInUsername(username);
            setId(data.id);
        }
        else{
            const obj = {
                username : username,
                password : password
            }
            const {data} = await axios.post("/login",obj);
            if(!data) return;
            setLoggedInUsername(username);
            setId(data.id);
        }
    }

    return (
        <div className='bg-blue-50 h-screen flex items-center'>
          <form className='w-64 mx-auto mb-12'onSubmit={handleSubmit}>
            <input 
                value={username} 
                onChange={ev=> setUsername(ev.target.value)} 
                type="text" placeholder='username' 
                className='block w-full rounded-sm p-2 mb-2 border ' />

            <input value={password}
                onChange={ev => setPassword(ev.target.value)}
                type="password" placeholder='password' 
                className='block w-full rounded-sm p-2 mb-2 border' />

            <button type='submit' className='bg-blue-500 text-white block w-full rounded-sm p-2'>
                {isregisterpage ? "Register" : "Login"}
            </button>

            <div className='text-center mt-2'>
                {
                    isregisterpage && (
                        <div>
                            Already a member?  
                            <button onClick={()=>{setIsregisterpage((prev)=>!prev);}}>
                                 Login here
                            </button>
                        </div>
                    )
                }
                {
                    !isregisterpage && (
                        <div>
                            Don't have an account?     
                            <button onClick={()=>{setIsregisterpage((prev)=>!prev);}}>
                                Register
                            </button>
                        </div>
                    )
                }
            </div>
          </form>
        </div>
    )
}

export default RegisterLoginform
