import React, { useContext } from 'react'
import { UserContext } from './UserContex'
import RegisterLoginform from './Components/RegisterLoginform';
import Chat from './Components/Chat'

const Routes = () => {
    const {username,id} = useContext(UserContext);

    if(username){
        return <Chat/>
    }
  return (
    <>
        <RegisterLoginform/>
    </>
  )
}

export default Routes
