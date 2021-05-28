import React, { useState } from 'react';
import ChatInput from "./ChatInput"
import '../style.css';
import ChatBubble from './ChatBubble';
import io from "socket.io-client"
import UsersList from './UsersList';

const socket = io.connect("http://localhost:4000")
var i = 0

export default function ChatContanier(props) {

  const {name, mapTrigger} = props

  const [chatList, setChatlist] = useState([])
  const [loggedUsers, setloggedUsers] = useState([])

  // Scrolling to bottom vanilla js **
  function scrollToBot(){
    var element = document.getElementById("chat-id");
    element.scrollTop = element.scrollHeight; 
  }

  // Trigers when user click send message and update the message to chatList array **
  function handleSendText(text){
    setChatlist(prevValue => { return (
      [...prevValue,text])
    })
  }

  // --------------------------------------------COMUNICATION WITH SERVER-----------------------------------------


  //Map trigger changes to true when client enters chat **
  if (mapTrigger && i===0){
    socket.emit("details", name)
    i++
  }

  //Callback from server when somone entered chat **
  socket.on("details", (messagesDB, onlineUsers) => {
    setloggedUsers(onlineUsers)
    setChatlist(messagesDB)
    scrollToBot()
  })

  //Runs when somone quit **
  socket.on("userLeft", newUserList => {
      setloggedUsers(newUserList)
    })

  //forward message to server **
  function sendMessToServer(message){
    const time = new Date().toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit"
    });
    socket.emit("message", { name, message, time })
  }

  //Get message from server **
  socket.on("message", (messagesDB) =>{
    setChatlist(messagesDB)
    scrollToBot()
  })


  // --------------------------------------------END COMUNICATION WITH SERVER-----------------------------------------


  return (
    <div>
      <UsersList loggedUsers={loggedUsers}/>
      <div className="chat-box" id="chat-id">
        {chatList.map((message, index) => { 
          return (
          <ChatBubble key={index} message={message.message} name={message.name} time={message.time} />
        )}
        )}
          <ChatInput handleSendText={handleSendText} sendMessToServer={sendMessToServer}/>
      </div>
    </div>
  );
}
