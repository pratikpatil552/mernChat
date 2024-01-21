import React, { useContext, useEffect, useRef, useState } from 'react'
import Avatar from './Avatar.jsx';
import Logo from './Logo.jsx'
import { UserContext } from '../UserContex.jsx';
import { uniqBy} from "lodash";
import  axios from 'axios';

const Chat = () => {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const divUnderMessages = useRef();

    const {username,id} = useContext(UserContext);

    useEffect(()=>{
      connectTows();
    },[])

    function connectTows (){
      const ws = new WebSocket('ws://https://mcchatapi.azurewebsites.net');
      setWs(ws);
      ws.addEventListener('message',handleMessage);
      ws.addEventListener('close',()=>{
        setTimeout(()=>{
          console.log("disconnected... trying to reconnect");
          connectTows();
        },1000);
      })  
    }

    function showOnlinePeople (peopleArray){
      const peopleMap = {};
      peopleArray.forEach(({userId,username})=>{
        peopleMap[userId] = username;
      })
      setOnlinePeople(peopleMap);
    }

    function handleMessage(ev){

        const messageData = JSON.parse(ev.data);
        // message sent from backend is checked and parsed

        console.log({messageData,ev});
        
        // if message contains the list of all users
        if ('online' in messageData){
            const onlineExceptSelf = messageData.online.filter((person)=> person.username !== username);
            showOnlinePeople(onlineExceptSelf);
        }
        else if ('text' in messageData){
          // if it is just formal message
          setMessages(prev => [...prev,{...messageData}]);
        }
    }

    function selectContact (userId){
       setSelectedUserId(userId);
    }

    function sendMessage(ev){
      ev.preventDefault();
      console.log("sending message");
      ws.send(JSON.stringify(
        {
          recipient : selectedUserId,
          text : newMessageText,
        }
      ));
      setMessages(prev => [...prev,{
        text: newMessageText,
        sender : id,
        recipient : selectedUserId,
        _id : Date.now(),
      }]);

      console.log(messages);
      setNewMessageText("");
    }

    // scroll to the last
    useEffect(()=>{
      const div = divUnderMessages.current;
      if(div){
        div.scrollIntoView({behaviour:'smooth',block:'end'});
      }
    },[messages])


    // load the messages from database when selected user changes
    useEffect(()=>{
      if(selectedUserId){
        // we have to make data base query on path messages/$userid
        // axios.get("/messages/"+selectedUserId)
        async function messagesforuser (){
          const response = await axios.get("/messages/"+selectedUserId);
          if(response.data){
              //console.log(response);
              setMessages(response.data);
          }
          else{
              console.log("user is not logged in")
          }
        }
        messagesforuser();
      }
    },[selectedUserId])

    const messagesWithoutDup = uniqBy(messages,'_id');

  return (
    <div className='flex h-screen'>
      <div className="bg-white w-1/3">
        <Logo/>
        {
          Object.keys(onlinePeople).map(userId=>(
            <div key = {userId} onClick={()=>{selectContact(userId)}} className={'border-b border-gray-100 flex cursor-pointer '+(userId===selectedUserId ? 'bg-blue-50':'')}>
              {userId === selectedUserId && 
                <div className='w-1 bg-blue-500 h-12 rounded-r-md'></div>
              }
              <div className='flex items-center gap-2 py-2 pl-4'>
                <Avatar username={onlinePeople[userId]} userId={userId}/>
                <span className='text-gray-800'>{onlinePeople[userId]}</span>
              </div>
            </div> 
          ))
        }
      </div>

      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className='flex-grow'>
          { !selectedUserId && (
            <div className='flex h-full items-center justify-center'>
              <div className='text-gray-300'>&larr; Select a person to see the messages</div>
            </div>
          )}

          { selectedUserId && (
            <div className='relative h-full'>
              <div  className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2 '>
              {
                messagesWithoutDup.map(message => (
                  <div className={message.sender === id ? 'text-right' : 'text-left'}>
                    <div className={'text-left inline-block p-2 my-2 rounded-md text-sm  '+(message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}>
                    {message.text}
                  </div>
                  </div>
                  
                ))
              }
              <div ref={divUnderMessages}></div>
            </div>
            </div>
            
          )}
          
        </div>
        {selectedUserId && (
              <form className='flex gap-2' onSubmit={sendMessage}>
                  <input type="text" placeholder='Type your message here' 
                  value={newMessageText} onChange={ev => setNewMessageText(ev.target.value)}
                  className='bg-white border p-2 flex-grow rounded-lg' />
                  <button type='submit' className='bg-blue-500 p-2 text-white rounded-lg '>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                      </svg>
                  </button>
              </form>
        )}


      </div>
    </div>
  )
}

export default Chat
