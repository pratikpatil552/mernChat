import { createContext, useState,useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider ({children}){
    const [username,setUsername] = useState(null);
    const [id, setId] = useState(null);
    
    useEffect(()=>{
        async function infoFromCookie(){
            const response = await axios.get("/profile");
            if(response.data){
                setUsername(response.data.username);
                setId(response.data.userId);
            }
            else{
                console.log("user is not logged in")
            }
        }
        infoFromCookie();
    },[])


    return (    
        <UserContext.Provider value={{username,setUsername,id,setId}}>
            {children}
        </UserContext.Provider>
    )
}