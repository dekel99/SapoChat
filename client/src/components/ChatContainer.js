import React, { useState } from 'react';
import ChatInput from "./ChatInput"
import '../styles/chatContainer.css';
import ChatBubble from './ChatBubble';
import io from "socket.io-client"
import UsersList from './UsersList';

const socket = io.connect("http://localhost:4000")
var i = 0

export default function ChatContanier(props) {

  const {name, mapTrigger} = props

  const [chatList, setChatlist] = useState([])
  const [loggedUsers, setloggedUsers] = useState([])
  const userNamesArr = []
  const userIdArr = []

  function getTime(){
    const time = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
    return time
  }

  // Scrolling to bottom vanilla js **
  function scrollToBot(){
    var element = document.getElementById("chat-id");
    element.scrollTop = element.scrollHeight; 
  }

  // Trigers when user click send message and update the message to chatList array **
  async function handleSendText(text){
    const time = getTime()
    await setChatlist([...chatList,{message: text, name: name, time: time}])
    scrollToBot()
  }


  // --------------------------------------------COMUNICATION WITH SERVER-----------------------------------------

  // Map trigger changes to true when client enters chat **
  if (mapTrigger && i===0){
    socket.emit("details", name)
    i++
  }

  // Callback from server when somone entered chat **
  socket.on("details", (messagesDB, onlineUsers) => {

    document.getElementById("standard-full-width").focus();
    const newUserName = Object.values(onlineUsers[0])[0]
    const newUserId = Object.values(onlineUsers[0])[1]
    userIdArr.push(newUserId)
    userNamesArr.push(newUserName)

    function checkIfArrayIsUnique(myArray) {
      return myArray.length === new Set(myArray).size;
    }

    if (checkIfArrayIsUnique(userNamesArr)) { 
      setloggedUsers(onlineUsers)
      props.catchLoggedUsers(onlineUsers)
      setChatlist(messagesDB)
      scrollToBot()
    } else {
        if (!checkIfArrayIsUnique(userIdArr)) { 
          window.location.replace("http://localhost:3000/login")
        }
    }
  })

  // Runs when somone quit **
  socket.on("userLeft", newUserList => {
      setloggedUsers(newUserList)
  })

  // Forward message to server **
  function sendMessToServer(message){
    const time = getTime()
    socket.emit("message", { name, message, time })
  }

  // Get message from server **
  socket.on("message", (messagesDB) =>{
    setChatlist(messagesDB)
    scrollToBot()
  })

  // --------------------------------------------END COMUNICATION WITH SERVER-----------------------------------------

  return (
    <div>
      <div className="logged-users-container">
        <UsersList loggedUsers={loggedUsers}/>
      </div>

      <div className="chat-box" id="chat-id">
        {chatList.map((message, index) => { 
          return (
          <ChatBubble key={index} message={message.message} name={message.name} time={message.time} />
          )
        })}
          <ChatInput handleSendText={handleSendText} sendMessToServer={sendMessToServer}/>
      </div>
    </div>
  );
}
